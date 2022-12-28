package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"testing"

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
		respStatusToReturn int
		respDataToReturn   *testData
		expectedRespData   *testData
		expectedError      error
	}
	sampleTestData := testData{SomeField: "yolo"}

	testCases := []testCase{
		{nil, nil, http.StatusOK, nil, &testData{SomeField: ""}, nil},
		{nil, nil, http.StatusOK, &sampleTestData, &sampleTestData, nil},
		{nil, nil, http.StatusBadRequest, &sampleTestData, nil, fmt.Errorf("request to %s returned 400: map[some_field_lolol:yolo]", TEST_URL)},
		{nil, nil, http.StatusNotFound, &sampleTestData, nil, errors.New("not found")},
		{nil, nil, http.StatusInternalServerError, &sampleTestData, nil, fmt.Errorf("request to %s returned 500: map[some_field_lolol:yolo]", TEST_URL)},
		{nil, nil, http.StatusInternalServerError, nil, nil, fmt.Errorf("request to %s returned 500: map[]", TEST_URL)},
	}

	for _, tc := range testCases {
		result, err := sendRequest[testData](SendRequestParams{
			URL:                TEST_URL,
			Method:             http.MethodGet,
			Body:               tc.body,
			Headers:            tc.headers,
			ExpectedRespStatus: http.StatusOK,
			RetryAmount:        0,
			RetryIntervalSecs:  0,
			RoundTripFunc: func(req *http.Request) (*http.Response, error) {
				assert.Equal(t, TEST_URL, GetFullURL(req))
				dataBytes, _ := json.Marshal(tc.respDataToReturn)
				return &http.Response{
					StatusCode: tc.respStatusToReturn,
					Body:       io.NopCloser(bytes.NewBuffer(dataBytes)),
				}, nil
			},
		})

		assert.Equal(t, tc.expectedRespData, result)
		assert.Equal(t, tc.expectedError, err)
	}
}

func TestSendRequestRetriesOnFailure(t *testing.T) {
	expectedRetries := 5
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
			if attemptsCounted != expectedRetries {
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
