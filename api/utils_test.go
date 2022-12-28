package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

type testData struct {
	SomeField string `json:"some_field_lolol"`
}

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
		{nil, nil, http.StatusBadRequest, &sampleTestData, nil, errors.New("request to https://jerico-xyz/api/doesntmatter returned 400: map[some_field_lolol:yolo]")},
		{nil, nil, http.StatusNotFound, &sampleTestData, nil, errors.New("not found")},
		{nil, nil, http.StatusInternalServerError, &sampleTestData, nil, errors.New("request to https://jerico-xyz/api/doesntmatter returned 500: map[some_field_lolol:yolo]")},
		{nil, nil, http.StatusInternalServerError, nil, nil, errors.New("request to https://jerico-xyz/api/doesntmatter returned 500: map[]")},
	}

	for _, tc := range testCases {
		result, err := sendRequest[testData](SendRequestParams{
			URL:                "https://jerico-xyz/api/doesntmatter",
			Method:             http.MethodGet,
			Body:               tc.body,
			Headers:            tc.headers,
			ExpectedRespStatus: http.StatusOK,
			RetryAmount:        0,
			RetryIntervalSecs:  0,
			RoundTripFunc: func(*http.Request) (*http.Response, error) {
				dataBytes, _ := json.Marshal(tc.respDataToReturn)
				return &http.Response{
					StatusCode: tc.respStatusToReturn,
					Body:       ioutil.NopCloser(bytes.NewBuffer(dataBytes)),
				}, nil
			},
		})

		assert.Equal(t, tc.expectedRespData, result)
		assert.Equal(t, tc.expectedError, err)
	}
}

func TestSendRequestRetriesOnFailure(t *testing.T) {
	expectedRetries := 5
	nthAttempt := 1

	sendRequest[any](SendRequestParams{
		URL:                "https://jerico-xyz/api/doesntmatter",
		Method:             http.MethodGet,
		ExpectedRespStatus: http.StatusOK,
		RetryAmount:        expectedRetries,
		RetryIntervalSecs:  0,
		RoundTripFunc: func(*http.Request) (*http.Response, error) {
			if nthAttempt != expectedRetries {
				nthAttempt++
				return &http.Response{
					StatusCode: http.StatusInternalServerError,
				}, nil
			}
			return &http.Response{
				StatusCode: http.StatusOK,
			}, nil
		},
	})

	assert.Equal(t, expectedRetries, nthAttempt)
}
