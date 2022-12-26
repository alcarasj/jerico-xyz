package main

import (
	"fmt"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin/binding"
)

const DEFAULT_RETRY_AMOUNT = 3
const DEFAULT_RETRY_INTERVAL_SECS = 1

type CloudantPersistence struct {
	Host              string
	DatabaseName      string
	IBMCloudAPIKey    string
	IBMCloudIAMToken  *IBMCloudIAMToken
	URL               string
	RetryAmount       int
	RetryIntervalSecs int
}

type CloudantDoc struct {
	ID   string      `json:"_id"`
	Rev  string      `json:"_rev"`
	Data interface{} `json:"data"`
}

func InitCloudantPersistence(config MainConfig) (*CloudantPersistence, error) {
	token, err := getIBMCloudIAMToken(config.IBMCloudAPIKey)
	if err != nil {
		return nil, err
	}

	return &CloudantPersistence{
		DatabaseName:      config.DatabaseName,
		IBMCloudAPIKey:    config.IBMCloudAPIKey,
		Host:              config.CloudantHost,
		URL:               fmt.Sprintf("%s/%s", config.CloudantHost, config.DatabaseName),
		IBMCloudIAMToken:  token,
		RetryAmount:       DEFAULT_RETRY_AMOUNT,
		RetryIntervalSecs: DEFAULT_RETRY_INTERVAL_SECS,
	}, nil
}

func (p CloudantPersistence) GetDatabaseInfo() error {
	headers, _ := p.buildReqHeaders("")
	_, err := sendRequest[any](SendRequestParams{
		URL:                p.URL,
		Method:             http.MethodGet,
		Body:               nil,
		Headers:            headers,
		ExpectedRespStatus: http.StatusOK,
		RetryAmount:        p.RetryAmount,
		RetryIntervalSecs:  p.RetryIntervalSecs,
	})
	if err != nil {
		return err
	}
	return nil
}

func (p CloudantPersistence) GetDocumentByID(id string) (Document, error) {
	url := p.buildURLWithID(id)
	headers, err := p.buildReqHeaders("")
	if err != nil {
		return nil, err
	}

	doc, err := sendRequest[CloudantDoc](SendRequestParams{
		URL:                url,
		Method:             http.MethodGet,
		Body:               nil,
		Headers:            headers,
		ExpectedRespStatus: http.StatusOK,
		RetryAmount:        p.RetryAmount,
		RetryIntervalSecs:  p.RetryIntervalSecs,
	})
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (p CloudantPersistence) ModifyDocumentByID(id string, data interface{}, rev string) error {
	url := p.buildURLWithID(id)
	headers, err := p.buildReqHeaders(rev)
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
		RetryAmount:        p.RetryAmount,
		RetryIntervalSecs:  p.RetryIntervalSecs,
	})
	if err != nil {
		return err
	}

	if !(*result)["ok"].(bool) {
		return fmt.Errorf("failed to create document with ID %s", id)
	}
	return nil
}

func (doc CloudantDoc) GetData() interface{} {
	return doc.Data
}

func (doc CloudantDoc) GetID() string {
	return doc.ID
}

func (doc CloudantDoc) GetETag() string {
	return doc.Rev
}

func (p CloudantPersistence) buildURLWithID(id string) string {
	return fmt.Sprintf("%s/%s", p.URL, id)
}

func (p *CloudantPersistence) buildReqHeaders(rev string) (map[string]string, error) {
	headers := make(map[string]string)
	if p.IBMCloudIAMToken == nil || p.IBMCloudIAMToken.isExpired() {
		token, err := getIBMCloudIAMToken(p.IBMCloudAPIKey)
		if err != nil {
			return nil, err
		}
		p.IBMCloudIAMToken = token
	}
	headers["Authorization"] = fmt.Sprintf("Bearer %s", p.IBMCloudIAMToken.AccessToken)

	if rev != "" {
		headers["If-Match"] = rev
	}

	return headers, nil
}

func getIBMCloudIAMToken(apiKey string) (*IBMCloudIAMToken, error) {
	headers := make(map[string]string)
	headers["Content-Type"] = binding.MIMEPOSTForm
	data := url.Values{}
	data.Set("grant_type", "urn:ibm:params:oauth:grant-type:apikey")
	data.Set("apikey", apiKey)
	body := data.Encode()
	iamToken, err := sendRequest[IBMCloudIAMToken](SendRequestParams{
		URL:                IBM_CLOUD_IAM_TOKEN_ENDPOINT,
		Method:             http.MethodPost,
		Body:               body,
		Headers:            headers,
		ExpectedRespStatus: http.StatusOK,
		RetryAmount:        DEFAULT_RETRY_AMOUNT,
		RetryIntervalSecs:  DEFAULT_RETRY_INTERVAL_SECS,
	})
	if err != nil {
		return nil, err
	}
	return iamToken, nil
}
