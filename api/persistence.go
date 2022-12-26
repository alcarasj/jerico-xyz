package main

import (
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
	IAMToken                 *IBMCloudIAMToken
	URL                      string
	RetryAmount              int
	RetryIntervalSecs        int
}

func InitPersistence(config MainConfig) (*Persistence, error) {
	token, err := getIAMToken(config.IBMCloudAPIKey, config.IBMCloudIAMTokenEndpoint)
	if err != nil {
		return nil, err
	}

	return &Persistence{
		DatabaseName:             config.DatabaseName,
		IBMCloudAPIKey:           config.IBMCloudAPIKey,
		IBMCloudIAMTokenEndpoint: config.IBMCloudIAMTokenEndpoint,
		Host:                     config.CloudantHost,
		URL:                      fmt.Sprintf("%s/%s", config.CloudantHost, config.DatabaseName),
		IAMToken:                 token,
		RetryAmount:              DEFAULT_RETRY_AMOUNT,
		RetryIntervalSecs:        DEFAULT_RETRY_INTERVAL_SECS,
	}, nil
}

func (p Persistence) BuildURLWithID(id string) string {
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
	_, err := sendRequest[any](SendRequestParams{
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

func (p Persistence) GetDocumentByID(id string, withRetry bool) (*CloudantDoc, error) {
	url := p.BuildURLWithID(id)
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

	doc, err := sendRequest[CloudantDoc](SendRequestParams{
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

	return doc, nil
}

func (p Persistence) ModifyDocumentByID(id string, data any, rev string) error {
	url := p.BuildURLWithID(id)
	headers, err := p.BuildReqHeaders(rev)
	if err != nil {
		return err
	}

	body := make(map[string]interface{})
	body["data"] = data

	result, err := sendRequest[map[string]interface{}](SendRequestParams{
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

	if !(*result)["ok"].(bool) {
		return fmt.Errorf("failed to create document with ID %s", id)
	}
	return nil
}
