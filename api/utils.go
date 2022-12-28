package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin/binding"
)

const REQUEST_TIMEOUT_SECS = 10
const PRODUCTION = "PRODUCTION"
const DB_NAME = "jerico-xyz"
const IBM_CLOUD_IAM_TOKEN_ENDPOINT = "https://iam.cloud.ibm.com/identity/token"
const SKYNET_HOST = "https://skynet-xyz.herokuapp.com"

var ErrNotFound = errors.New("not found")

func getPackageVersion() (*string, error) {
	jsonFile, err := os.Open("package.json")
	if err != nil {
		return nil, err
	}
	defer jsonFile.Close()
	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		return nil, err
	}

	var result map[string]interface{}
	json.Unmarshal([]byte(byteValue), &result)
	version := result["version"].(string)
	return &version, nil
}

func getBundleURL(bucketURL string, mode string) string {
	packageVersion, _ := getPackageVersion()
	if mode == PRODUCTION {
		return fmt.Sprintf("%s/bundle/main-%s.js", bucketURL, *packageVersion)
	} else {
		return fmt.Sprintf("./static/bundle/bundle-%s/main.js", *packageVersion)
	}
}

func sendRequest[T any](params SendRequestParams) (*T, error) {
	if params.URL == "" || params.Method == "" {
		return nil, errors.New("URL and method must be provided")
	}

	var dataBytes []byte
	if params.Body != nil {
		if strings.Contains(params.Headers["Content-Type"], binding.MIMEPOSTForm) {
			data := params.Body.(string)
			dataBytes = []byte(data)
		} else if strings.Contains(params.Headers["Content-Type"], binding.MIMEMultipartPOSTForm) {
			dataBytes = params.Body.([]byte)
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
	if params.RoundTripFunc != nil {
		client.Transport = params.RoundTripFunc
	}

	var resp *http.Response
	nthAttempt := 1

	for shouldRetryOnFailure := true; shouldRetryOnFailure; shouldRetryOnFailure = nthAttempt <= params.RetryAmount {
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
		defer resp.Body.Close()

		if resp.StatusCode == params.ExpectedRespStatus {
			break
		}
		if nthAttempt <= params.RetryAmount {
			log.Printf("%s %s failed on attempt #%d, retrying...", params.Method, params.URL, nthAttempt)
			time.Sleep(time.Duration(params.RetryIntervalSecs) * time.Second)
		}
		nthAttempt++
	}

	if resp.StatusCode != params.ExpectedRespStatus {
		if resp.StatusCode == http.StatusNotFound {
			return nil, ErrNotFound
		}
		var errorBody map[string]string
		json.NewDecoder(resp.Body).Decode(&errorBody)
		return nil, fmt.Errorf("request to %s returned %d: %v", params.URL, resp.StatusCode, errorBody)
	}

	var data T
	err := json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return nil, err
	}

	return &data, nil
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
		Port:           envVars["PORT"],
		Mode:           envVars["MODE"],
		S3BucketURL:    fmt.Sprintf("%s/%s", envVars["S3_HOST"], envVars["BUCKET_NAME"]),
		IBMCloudAPIKey: envVars["IBM_CLOUD_API_KEY"],
		CloudantHost:   envVars["CLOUDANT_HOST"],
		DatabaseName:   DB_NAME,
		SkynetHost:     SKYNET_HOST,
	}
}

func (f RoundTripFunc) RoundTrip(r *http.Request) (*http.Response, error) {
	return f(r)
}
