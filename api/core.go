package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"time"
)

const VIEW_COUNTER_BUFFER_SECONDS = 60
const VIEW_COUNTER_DOC_ID = "ViewCounter"
const IP_DETAILS_DOC_ID = "IPDetails"

type Core struct {
	Persistence Persistence
	Cache       Cache
}

func (c Core) RecordView(ip string) error {
	if isLocalhost(ip) {
		return fmt.Errorf("cannot record view for %s", ip)
	}

	doc, err := c.Persistence.GetDocumentByID(VIEW_COUNTER_DOC_ID, false)
	if err != nil {
		return err
	}

	viewCounter := unmarshalViewCounterData(doc.Data)
	shouldUpdatePersistence := false
	now := time.Now().UTC()
	currentDateStr := now.Format("2006-01-02")

	if dayEntry, dayEntryWasFound := viewCounter[currentDateStr]; dayEntryWasFound {
		if clientEntry, clientEntryWasFound := dayEntry[ip]; clientEntryWasFound {
			if now.Sub(clientEntry.LastUpdated).Seconds() > VIEW_COUNTER_BUFFER_SECONDS {
				dayEntry[ip] = ViewCounterClientEntry{
					Views:       clientEntry.Views + 1,
					LastUpdated: now,
				}
				viewCounter[currentDateStr] = dayEntry
				shouldUpdatePersistence = true
			}
		} else {
			dayEntry[ip] = ViewCounterClientEntry{
				Views:       1,
				LastUpdated: now,
			}
			viewCounter[currentDateStr] = dayEntry
			shouldUpdatePersistence = true
		}
	} else {
		newDayEntry := make(ViewCounterDayEntry)
		newDayEntry[ip] = ViewCounterClientEntry{
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

func (c Core) GetTrafficData(callerIP string, timeInterval TimeInterval, intervals int) (map[string]TrafficDatapoint, error) {
	if intervals <= 0 {
		return nil, fmt.Errorf("must be at least N >= 1 intervals but was %d", intervals)
	}

	doc, err := c.Persistence.GetDocumentByID(VIEW_COUNTER_DOC_ID, true)
	if err != nil {
		return nil, err
	}

	data := unmarshalViewCounterData(doc.Data)
	sortedDates := make([]string, len(data))
	i := 0
	for key := range data {
		sortedDates[i] = key
		i++
	}
	sort.Sort(sort.Reverse(sort.StringSlice(sortedDates)))
	// TO-DO Save calculated values (since when a day has ended the values will stay the same forever)
	result := timeInterval.AggregateViews(sortedDates, data, intervals, callerIP)
	return result, nil
}

func (c Core) SaveClientData(ip string, data map[string]string, savedData map[string]interface{}, rev string) error {
	savedData[ip] = data
	return c.Persistence.ModifyDocumentByID(IP_DETAILS_DOC_ID, savedData, rev)
}

func (c Core) GetClientData(ip string) (*ClientData, error) {
	if isLocalhost(ip) {
		return nil, fmt.Errorf("cannot lookup client data for %s", ip)
	}

	fetchIPDetails := func() (interface{}, error) {
		url := fmt.Sprintf("https://ipapi.co/%s/json/", ip)
		resp, err := sendRequest(SendRequestParams{
			URL:                url,
			Method:             http.MethodGet,
			Body:               nil,
			Headers:            nil,
			ExpectedRespStatus: http.StatusOK,
			RetryAmount:        0,
			RetryIntervalSecs:  0,
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

	doc, err := c.Persistence.GetDocumentByID(IP_DETAILS_DOC_ID, false)
	if err != nil {
		return nil, err
	}

	savedData, ok := doc.Data.(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("failed to parse client data: %v", savedData)
	}

	if savedEntry, ok := savedData[ip].(map[string]interface{}); ok {
		return &ClientData{
			IP:          ip,
			City:        savedEntry["city"].(string),
			Region:      savedEntry["region"].(string),
			CountryName: savedEntry["country_name"].(string),
		}, nil
	}

	val, err := c.Cache.Get(ip, fetchIPDetails)
	if err != nil {
		return &ClientData{
			IP:          ip,
			City:        "",
			Region:      "",
			CountryName: "",
		}, err
	}
	result := val.(map[string]string)
	c.SaveClientData(ip, result, savedData, doc.Rev)

	return &ClientData{
		IP:          ip,
		City:        result["city"],
		Region:      result["region"],
		CountryName: result["country_name"],
	}, nil
}
