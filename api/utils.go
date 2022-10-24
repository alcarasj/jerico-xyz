package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

const REQUEST_TIMEOUT_SECS = 10
const PRODUCTION = "PRODUCTION"
const DB_NAME = "jerico-xyz"

var ErrNotFound = errors.New("not found")

func getPackageVersion() string {
	jsonFile, error := os.Open("package.json")
	if error != nil {
		fmt.Println(error)
	}
	defer jsonFile.Close()
	byteValue, _ := ioutil.ReadAll(jsonFile)

	var result map[string]interface{}
	json.Unmarshal([]byte(byteValue), &result)
	return result["version"].(string)
}

func getBundleURL(bucketURL string, mode string) string {
	packageVersion := getPackageVersion()
	if mode == PRODUCTION {
		return fmt.Sprintf("%s/bundle/main-%s.js", bucketURL, packageVersion)
	} else {
		return fmt.Sprintf("./static/bundle/bundle-%s/main.js", packageVersion)
	}
}

func sendRequest(params SendRequestParams) (*http.Response, error) {
	if params.URL == "" || params.Method == "" {
		return nil, errors.New("URL and method must be provided")
	}

	dataBytes := []byte{}
	if params.Body != nil {
		if params.Headers != nil && params.Headers["Content-Type"] == "application/x-www-form-urlencoded" {
			data, _ := params.Body.(string)
			dataBytes = []byte(data)
		} else {
			data, _ := params.Body.(map[string]interface{})
			dataBytes, _ = json.Marshal(data)
		}
	}

	req, err := http.NewRequest(params.Method, params.URL, bytes.NewBuffer(dataBytes))
	if err != nil {
		return nil, err
	}
	for key, val := range params.Headers {
		req.Header.Set(key, val)
	}

	client := &http.Client{
		Timeout: time.Duration(REQUEST_TIMEOUT_SECS) * time.Second,
	}
	var resp *http.Response
	i := 0

	for ok := true; ok; ok = i < params.RetryAmount {
		resp, err = client.Do(req)
		if resp != nil {
			log.Println(fmt.Sprintf("%s %d %s", params.Method, resp.StatusCode, params.URL))
		}
		if err == nil && resp != nil && resp.StatusCode == params.ExpectedRespStatus {
			break
		}
		if i < params.RetryAmount-1 {
			log.Println(fmt.Sprintf("%s %s failed on attempt #%d, retrying...", params.Method, params.URL, i+1))
			time.Sleep(time.Duration(params.RetryIntervalSecs) * time.Second)
		}
		i++
	}

	if err != nil {
		return nil, err
	}
	if resp.StatusCode != params.ExpectedRespStatus {
		if resp.StatusCode == http.StatusNotFound {
			return nil, ErrNotFound
		}
		var errorBody map[string]string
		json.NewDecoder(resp.Body).Decode(&errorBody)
		return nil, fmt.Errorf("request to %s returned %d: %v", params.URL, resp.StatusCode, errorBody)
	}

	return resp, nil
}

func getIAMToken(apiKey string, iamTokenEndpoint string) (*IAMToken, error) {
	headers := make(map[string]string)
	headers["Content-Type"] = "application/x-www-form-urlencoded"
	body := fmt.Sprintf("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=%s", apiKey)
	resp, err := sendRequest(SendRequestParams{
		URL:                iamTokenEndpoint,
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

	var tokenData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&tokenData); err != nil {
		return nil, err
	}

	return &IAMToken{
		AccessToken:     tokenData["access_token"].(string),
		RefreshToken:    tokenData["refresh_token"].(string),
		ExpiresInSecs:   tokenData["expires_in"].(float64),
		ExpirationEpoch: tokenData["expiration"].(float64),
		Type:            tokenData["token_type"].(string),
	}, nil
}

func (t IAMToken) isExpired() bool {
	return time.Now().Unix() > int64(t.ExpirationEpoch)
}

func isLocalhost(ip string) bool {
	return ip == "::1" || ip == "127.0.0.1"
}

func buildMainConfigFromEnvVars() MainConfig {
	envVars := make(map[string]string)

	requiredEnvVars := []string{"PORT", "S3_HOST", "BUCKET_NAME", "IBM_CLOUD_API_KEY", "IBM_CLOUD_IAM_TOKEN_ENDPOINT", "CLOUDANT_HOST"}
	for _, varName := range requiredEnvVars {
		val := os.Getenv(varName)
		if val == "" {
			log.Fatalf("%s must be set!", varName)
		}
		envVars[varName] = val
	}

	optionalEnvVars := []string{"MODE"}
	for _, varName := range optionalEnvVars {
		envVars[varName] = os.Getenv(varName)
	}

	return MainConfig{
		Port:                     envVars["PORT"],
		Mode:                     envVars["MODE"],
		S3BucketURL:              fmt.Sprintf("%s/%s", envVars["S3_HOST"], envVars["BUCKET_NAME"]),
		IBMCloudAPIKey:           envVars["IBM_CLOUD_API_KEY"],
		IBMCloudIAMTokenEndpoint: envVars["IBM_CLOUD_IAM_TOKEN_ENDPOINT"],
		CloudantHost:             envVars["CLOUDANT_HOST"],
		DatabaseName:             DB_NAME,
	}
}

func (t TimeInterval) String() (string, bool) {
	switch t {
	case Daily:
		return "Daily", true
	case Weekly:
		return "Weekly", true
	}
	return "", false
}

func stringToTimeInterval(s string) (TimeInterval, bool) {
	switch strings.ToLower(s) {
	case "daily":
		return Daily, true
	case "weekly":
		return Weekly, true
	}
	return 0, false
}
