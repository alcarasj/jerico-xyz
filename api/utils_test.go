package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"testing"
	"time"

	"github.com/gin-gonic/gin/binding"
	"github.com/stretchr/testify/assert"
)

type testData struct {
	SomeField string `json:"some_field_lolol"`
}

const TEST_URL = "https://jerico.xyz/api/doesntmatterswagyolo"

func TestSendRequestReturnsCorrectData(t *testing.T) {
	type testCase struct {
		body               interface{}
		headers            map[string]string
		method             string
		respStatusToReturn int
		respBytesToReturn  []byte
		expectedRespData   *testData
		expectedError      error
	}
	multipartFormHeaders := map[string]string{"Content-Type": binding.MIMEMultipartPOSTForm}
	formHeaders := map[string]string{"Content-Type": binding.MIMEPOSTForm}
	sampleRespData := testData{SomeField: "yolo"}
	sampleReqData := testData{SomeField: "swag"}
	sampleReqString := "helicopterhelicopterrr"

	sampleRespDataBytes, _ := json.Marshal(sampleRespData)

	testCases := []testCase{
		{nil, nil, http.MethodGet, http.StatusOK, sampleRespDataBytes, &sampleRespData, nil},
		{nil, nil, http.MethodGet, http.StatusOK, []byte(""), nil, errors.New("EOF")},
		{nil, nil, http.MethodGet, http.StatusOK, nil, nil, errors.New("EOF")},
		{nil, nil, http.MethodGet, http.StatusBadRequest, sampleRespDataBytes, nil, fmt.Errorf("GET request to %s returned 400: map[some_field_lolol:yolo]", TEST_URL)},
		{nil, nil, http.MethodGet, http.StatusNotFound, sampleRespDataBytes, nil, errors.New("not found")},
		{nil, nil, http.MethodGet, http.StatusInternalServerError, sampleRespDataBytes, nil, fmt.Errorf("GET request to %s returned 500: map[some_field_lolol:yolo]", TEST_URL)},
		{nil, nil, http.MethodGet, http.StatusInternalServerError, []byte(""), nil, fmt.Errorf("GET request to %s returned 500: map[]", TEST_URL)},
		{nil, nil, http.MethodGet, http.StatusInternalServerError, nil, nil, fmt.Errorf("GET request to %s returned 500: map[]", TEST_URL)},

		{nil, nil, http.MethodPost, http.StatusOK, sampleRespDataBytes, &sampleRespData, nil},
		{sampleReqData, nil, http.MethodPost, http.StatusOK, sampleRespDataBytes, &sampleRespData, nil},
		{sampleReqData, nil, http.MethodPost, http.StatusOK, []byte(""), nil, errors.New("EOF")},
		{sampleReqString, formHeaders, http.MethodPost, http.StatusOK, sampleRespDataBytes, &sampleRespData, nil},
		{[]byte(sampleReqString), multipartFormHeaders, http.MethodPost, http.StatusOK, sampleRespDataBytes, &sampleRespData, nil},
		{nil, nil, http.MethodPost, http.StatusBadRequest, sampleRespDataBytes, nil, fmt.Errorf("POST request to %s returned 400: map[some_field_lolol:yolo]", TEST_URL)},
		{nil, nil, http.MethodPost, http.StatusNotFound, sampleRespDataBytes, nil, errors.New("not found")},
		{sampleReqData, nil, http.MethodPost, http.StatusInternalServerError, sampleRespDataBytes, nil, fmt.Errorf("POST request to %s returned 500: map[some_field_lolol:yolo]", TEST_URL)},
		{sampleReqData, nil, http.MethodPost, http.StatusInternalServerError, []byte(""), nil, fmt.Errorf("POST request to %s returned 500: map[]", TEST_URL)},
		{sampleReqData, nil, http.MethodPost, http.StatusInternalServerError, nil, nil, fmt.Errorf("POST request to %s returned 500: map[]", TEST_URL)},
	}

	for _, tc := range testCases {
		result, err := sendRequest[testData](SendRequestParams{
			URL:                TEST_URL,
			Method:             tc.method,
			Body:               tc.body,
			Headers:            tc.headers,
			ExpectedRespStatus: http.StatusOK,
			RetryAmount:        0,
			RetryIntervalSecs:  0,
			RoundTripFunc: func(req *http.Request) (*http.Response, error) {
				assert.Equal(t, TEST_URL, GetFullURL(req))
				if tc.body != nil {
					reqBodyBytes, _ := io.ReadAll(req.Body)
					var expectedBodyBytes []byte
					switch tc.body.(type) {
					case string:
						expectedBodyBytes = []byte(tc.body.(string))
					case []byte:
						expectedBodyBytes = tc.body.([]byte)
					default:
						expectedBodyBytes, _ = json.Marshal(tc.body)
					}
					assert.Equal(t, expectedBodyBytes, reqBodyBytes)
				}

				return &http.Response{
					StatusCode: tc.respStatusToReturn,
					Body:       io.NopCloser(bytes.NewBuffer(tc.respBytesToReturn)),
				}, nil
			},
		})

		assert.Equal(t, tc.expectedRespData, result)
		assert.Equal(t, tc.expectedError, err)
	}
}

func TestSendRequestRetriesOnFailure(t *testing.T) {
	rand.Seed(time.Now().UnixNano())
	expectedRetries := rand.Intn(10) + 5 // 5 <= N <= 15
	attemptsCounted := 0

	sendRequest[any](SendRequestParams{
		URL:                TEST_URL,
		Method:             http.MethodGet,
		ExpectedRespStatus: http.StatusOK,
		RetryAmount:        expectedRetries,
		RetryIntervalSecs:  0,
		RoundTripFunc: func(req *http.Request) (*http.Response, error) {
			assert.Equal(t, TEST_URL, GetFullURL(req))
			attemptsCounted++
			if attemptsCounted < expectedRetries {
				return &http.Response{
					StatusCode: http.StatusInternalServerError,
				}, nil
			}
			return &http.Response{
				StatusCode: http.StatusOK,
			}, nil
		},
	})

	assert.Equal(t, expectedRetries, attemptsCounted)
}
