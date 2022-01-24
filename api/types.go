package main

import "time"

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

type ViewCounterDayEntry map[string]*ViewCounterClientEntry

type ViewCounter map[string]ViewCounterDayEntry
