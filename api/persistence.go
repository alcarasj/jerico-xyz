package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

const DEFAULT_RETRY_AMOUNT = 3
const DEFAULT_RETRY_INTERVAL_SECS = 1

type Persistence struct {
	Host                     string
	DatabaseName             string
	IBMCloudAPIKey           string
	IBMCloudIAMTokenEndpoint string
	IAMToken                 *IAMToken
	URL                      string
	RetryAmount              int
	RetryIntervalSecs        int
}

func InitPersistence(dbName string, apiKey string, host string, iamTokenEndpoint string) (*Persistence, error) {
	if dbName == "" || apiKey == "" || host == "" || iamTokenEndpoint == "" {
		return nil, errors.New("database name, host, IAM token endpoint and API key must not be blank")
	}

	token, err := getIAMToken(apiKey, iamTokenEndpoint)
	if err != nil {
		return nil, err
	}

	return &Persistence{
		DatabaseName:      dbName,
		IBMCloudAPIKey:    apiKey,
		Host:              host,
		URL:               fmt.Sprintf("%s/%s", host, dbName),
		IAMToken:          token,
		RetryAmount:       DEFAULT_RETRY_AMOUNT,
		RetryIntervalSecs: DEFAULT_RETRY_INTERVAL_SECS,
	}, nil
}

func (p Persistence) BuildURLWithId(id string) string {
	return fmt.Sprintf("%s/%s", p.URL, id)
}

func (p *Persistence) BuildReqHeaders(rev string) (map[string]string, error) {
	headers := make(map[string]string)
	if p.IAMToken == nil || p.IAMToken.isExpired() {
		token, err := getIAMToken(p.IBMCloudAPIKey, p.IBMCloudIAMTokenEndpoint)
		if err != nil {
			return nil, err
		}
		p.IAMToken = token
	}
	headers["Authorization"] = fmt.Sprintf("Bearer %s", p.IAMToken.AccessToken)

	if rev != "" {
		headers["If-Match"] = rev
	}

	return headers, nil
}

func (p Persistence) GetDatabaseInfo() error {
	headers, _ := p.BuildReqHeaders("")
	_, err := sendRequest(SendRequestParams{
		URL:                p.URL,
		Method:             http.MethodGet,
		Body:               nil,
		Headers:            headers,
		ExpectedRespStatus: http.StatusOK,
		RetryAmount:        DEFAULT_RETRY_AMOUNT,
		RetryIntervalSecs:  DEFAULT_RETRY_INTERVAL_SECS,
	})
	if err != nil {
		return err
	}
	return nil
}

func (p Persistence) GetDocumentById(id string, withRetry bool) (*CloudantDoc, error) {
	url := p.BuildURLWithId(id)
	headers, err := p.BuildReqHeaders("")
	if err != nil {
		return nil, err
	}

	var retryAmount int
	if withRetry {
		retryAmount = DEFAULT_RETRY_AMOUNT
	} else {
		retryAmount = 0
	}

	resp, err := sendRequest(SendRequestParams{
		URL:                url,
		Method:             http.MethodGet,
		Body:               nil,
		Headers:            headers,
		ExpectedRespStatus: http.StatusOK,
		RetryAmount:        retryAmount,
		RetryIntervalSecs:  DEFAULT_RETRY_INTERVAL_SECS,
	})
	if err != nil {
		return nil, err
	}

	var doc map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&doc)

	return &CloudantDoc{
		ID:   doc["_id"].(string),
		Rev:  doc["_rev"].(string),
		Data: doc["data"],
	}, nil
}

func (p Persistence) ModifyDocumentById(id string, data interface{}, rev string) error {
	url := p.BuildURLWithId(id)
	headers, err := p.BuildReqHeaders(rev)
	if err != nil {
		return err
	}

	body := make(map[string]interface{})
	body["data"] = data

	resp, err := sendRequest(SendRequestParams{
		URL:                url,
		Method:             http.MethodPut,
		Body:               body,
		Headers:            headers,
		ExpectedRespStatus: http.StatusCreated,
		RetryAmount:        DEFAULT_RETRY_AMOUNT,
		RetryIntervalSecs:  DEFAULT_RETRY_INTERVAL_SECS,
	})
	if err != nil {
		return err
	}

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	if !result["ok"].(bool) {
		return fmt.Errorf("failed to create or modify document with ID %s", id)
	}
	return nil
}
