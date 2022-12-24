package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"
)

const REQUEST_TIMEOUT_SECS = 10
const PRODUCTION = "PRODUCTION"
const DB_NAME = "jerico-xyz"
const IBM_CLOUD_IAM_TOKEN_ENDPOINT = "https://iam.cloud.ibm.com/identity/token"
const SKYNET_HOST = "https://skynet-xyz.herokuapp.com"

var ErrNotFound = errors.New("not found")

func getPackageVersion() string {
	jsonFile, error := os.Open("package.json")
	if error != nil {
		fmt.Println(error)
	}
	defer jsonFile.Close()
	byteValue, _ := io.ReadAll(jsonFile)

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

func sendRequest[T any](params SendRequestParams[T]) (*http.Response, error) {
	if params.URL == "" || params.Method == "" {
		return nil, errors.New("URL and method must be provided")
	}

	var dataBytes []byte
	if params.Body != nil {
		if params.Headers != nil && params.Headers["Content-Type"] == "application/x-www-form-urlencoded" {
			data := fmt.Sprintf("%v", *params.Body)
			dataBytes = []byte(data)
		} else {
			var err error
			dataBytes, err = json.Marshal(params.Body)
			if err != nil {
				return nil, err
			}
		}
	} else {
		dataBytes = []byte{}
	}

	client := &http.Client{
		Timeout: time.Duration(REQUEST_TIMEOUT_SECS) * time.Second,
	}
	var resp *http.Response
	i := 1

	for shouldRetryOnFailure := true; shouldRetryOnFailure; shouldRetryOnFailure = i <= params.RetryAmount {
		req, err := http.NewRequest(params.Method, params.URL, bytes.NewBuffer(dataBytes))
		if err != nil {
			return nil, err
		}
		for key, val := range params.Headers {
			req.Header.Add(key, val)
		}

		resp, err = client.Do(req)
		if err != nil {
			return nil, err
		}
		if resp != nil {
			log.Printf("%s %d %s", params.Method, resp.StatusCode, params.URL)
		}
		if resp.StatusCode == params.ExpectedRespStatus {
			break
		}
		if i <= params.RetryAmount {
			log.Printf("%s %s failed on attempt #%d, retrying...", params.Method, params.URL, i)
			time.Sleep(time.Duration(params.RetryIntervalSecs) * time.Second)
		}
		i++
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
	data := url.Values{}
	data.Set("grant_type", "urn:ibm:params:oauth:grant-type:apikey")
	data.Set("apikey", apiKey)
	body := data.Encode()
	resp, err := sendRequest(SendRequestParams[string]{
		URL:                iamTokenEndpoint,
		Method:             http.MethodPost,
		Body:               &body,
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

	requiredEnvVars := []string{"PORT", "S3_HOST", "BUCKET_NAME", "IBM_CLOUD_API_KEY", "CLOUDANT_HOST"}
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
		IBMCloudIAMTokenEndpoint: IBM_CLOUD_IAM_TOKEN_ENDPOINT,
		CloudantHost:             envVars["CLOUDANT_HOST"],
		DatabaseName:             DB_NAME,
		SkynetHost:               SKYNET_HOST,
	}
}
