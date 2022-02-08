package main

import (
	"time"
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

type IAMToken struct {
	AccessToken     string
	RefreshToken    string
	Type            string
	ExpiresInSecs   float64
	ExpirationEpoch float64
}

type SendRequestParams struct {
	URL                string
	Method             string
	Body               interface{}
	Headers            map[string]string
	ExpectedRespStatus int
	RetryAmount        int
	RetryIntervalSecs  int
}

type CloudantDoc struct {
	ID   string
	Rev  string
	Data interface{}
}

type MainConfig struct {
	Port                     string
	Mode                     string
	S3BucketURL              string
	IBMCloudAPIKey           string
	IBMCloudIAMTokenEndpoint string
	CloudantHost             string
	DatabaseName             string
}

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

type Card struct {
	Suit string `json:"suit"`
	Rank int    `json:"rank"`
}

type Game struct {
	ID    string `json:"id"`
	Moves []Move `json:"moves"`
}

type Move struct {
	ID     string     `json:"id"`
	Player ClientData `json:"player"`
}
