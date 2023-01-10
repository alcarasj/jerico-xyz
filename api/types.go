package main

import (
	"net/http"
	"time"
)

type TimeInterval int

const (
	Daily TimeInterval = iota
	Weekly
	Monthly
	Yearly
)

type Exhibit struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	DateCreated string `json:"dateCreated"`
	Collection  string `json:"collection"`
	ImageURL    string `json:"imageURL"`
}

type Message struct {
	ClientIP  string    `json:"clientIP"`
	Body      string    `json:"body"`
	Location  string    `json:"location"`
	CreatedAt time.Time `json:"createdAt"`
}

type ViewCounterClientEntry struct {
	Views       int       `json:"views"`
	LastUpdated time.Time `json:"lastUpdated"`
}

type ViewCounterDayEntry map[string]ViewCounterClientEntry

type ViewCounterData map[string]ViewCounterDayEntry

type ViewCounterDataSegments map[string]ViewCounterData

type IBMCloudIAMToken struct {
	AccessToken     string `json:"access_token"`
	Type            string `json:"token_type"`
	ExpiresInSecs   int    `json:"expires_in"`
	ExpirationEpoch int    `json:"expiration"`
}

type AzureADToken struct {
	AccessToken     string `json:"access_token"`
	Type            string `json:"token_type"`
	ExpiresInSecs   int    `json:"expires_in"`
	ExpirationEpoch int    `json:"expires_on"`
}

type SendRequestParams struct {
	URL                string
	Method             string
	Body               any
	Headers            map[string]string
	ExpectedRespStatus int
	RetryAmount        int
	RetryIntervalSecs  int
	RoundTripFunc      RoundTripFunc
}

type MainConfig struct {
	Port           string
	Mode           string
	S3BucketURL    string
	IBMCloudAPIKey string
	CloudantHost   string
	DatabaseName   string
	SkynetHost     string
}

type TrafficData map[string]TrafficDatapoint

type TrafficDatapoint struct {
	TotalViews  int `json:"totalViews"`
	UniqueViews int `json:"uniqueViews"`
	SelfViews   int `json:"selfViews"`
}

type ClientData struct {
	IP          string `json:"ip"`
	City        string `json:"city"`
	Region      string `json:"region"`
	CountryName string `json:"countryName"`
}

type ImageClassifierClasses map[string][]string

type ImageClassifierPrediction struct {
	Prediction string `json:"prediction"`
}

type Persistence interface {
	GetDatabaseInfo() error
	ModifyDocumentByID(string, interface{}, string) error
	GetDocumentByID(string) (Document, error)
}

type Document interface {
	GetID() string
	GetData() interface{}
	GetETag() string
}

type RoundTripFunc func(*http.Request) (*http.Response, error)
