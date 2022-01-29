package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const VIEW_COUNTER_BUFFER_SECONDS = 10
const VIEW_COUNTER_DOC_ID = "ViewCounter"

type Core struct {
	Persistence Persistence
	Cache       Cache
}

func (c Core) RecordView(clientIP string) error {
	doc, err := c.Persistence.GetDocumentByID(VIEW_COUNTER_DOC_ID, false)
	if err != nil {
		return err
	}

	viewCounter := doc.Data.(map[string]interface{})
	shouldUpdatePersistence := false
	now := time.Now().UTC()
	currentDateStr := now.Format("2006-01-02")

	if dayEntry, dayEntryWasFound := viewCounter[currentDateStr]; dayEntryWasFound {
		dayEntry, _ := dayEntry.(map[string]interface{})
		if clientEntry, clientEntryWasFound := dayEntry[clientIP]; clientEntryWasFound {
			clientEntry := clientEntry.(map[string]interface{})
			lastUpdatedStr := clientEntry["lastUpdated"].(string)
			lastUpdated, _ := time.Parse(time.RFC3339, lastUpdatedStr)
			if now.Sub(lastUpdated).Seconds() > VIEW_COUNTER_BUFFER_SECONDS {
				dayEntry[clientIP] = ViewCounterClientEntry{
					Views:       int(clientEntry["views"].(float64)) + 1,
					LastUpdated: now,
				}
				viewCounter[currentDateStr] = dayEntry
				shouldUpdatePersistence = true
			}
		} else {
			dayEntry[clientIP] = ViewCounterClientEntry{
				Views:       1,
				LastUpdated: now,
			}
			viewCounter[currentDateStr] = dayEntry
			shouldUpdatePersistence = true
		}
	} else {
		newDayEntry := make(ViewCounterDayEntry)
		newDayEntry[clientIP] = ViewCounterClientEntry{
			Views:       1,
			LastUpdated: now,
		}
		viewCounter[currentDateStr] = newDayEntry
		shouldUpdatePersistence = true
	}

	if shouldUpdatePersistence {
		return c.Persistence.ModifyDocumentByID(VIEW_COUNTER_DOC_ID, viewCounter, doc.Rev)
	} else {
		return nil
	}
}

func (c Core) GetTotalViewsPerDay() (map[string]int, error) {
	doc, err := c.Persistence.GetDocumentByID(VIEW_COUNTER_DOC_ID, true)
	if err != nil {
		return nil, err
	}

	data := doc.Data.(map[string]interface{})
	result := make(map[string]int)
	for date, dayEntry := range data {
		dayEntry := dayEntry.(map[string]interface{})
		dayViews := 0
		for _, clientEntry := range dayEntry {
			clientEntry := clientEntry.(map[string]interface{})
			dayViews += int(clientEntry["views"].(float64))
		}
		result[date] = dayViews
	}

	return result, err
}

func (c Core) GetClientData(ip string) (string, error) {
	fetchIPDetails := func() (interface{}, error) {
		url := fmt.Sprintf("https://ipapi.co/%s/json/", ip)
		resp, err := sendRequest(SendRequestParams{
			URL:                url,
			Method:             http.MethodGet,
			Body:               nil,
			Headers:            nil,
			ExpectedRespStatus: http.StatusOK,
			RetryAmount:        DEFAULT_RETRY_AMOUNT,
			RetryIntervalSecs:  DEFAULT_RETRY_INTERVAL_SECS,
		})
		if err != nil {
			return nil, err
		}

		var result map[string]string
		json.NewDecoder(resp.Body).Decode(&result)

		if _, found := result["error"]; found {
			return nil, fmt.Errorf("failed to get client data: %v", result)
		}

		return result, nil
	}

	val, err := c.Cache.Get(ip, fetchIPDetails)
	if err != nil {
		return "", err
	}
	clientData := val.(map[string]string)

	var location string
	if clientData["city"] != "" && clientData["region"] != "" && clientData["country_name"] != "" {
		location = fmt.Sprintf("%s, %s, %s", clientData["city"], clientData["region"], clientData["country_name"])
	} else {
		location = ""
	}
	return location, nil
}
