package main

import (
	"container/list"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const VIEW_COUNTER_BUFFER_SECONDS = 10
const VIEW_COUNTER_DOC_ID = "ViewCounter"

func recordView(clientIP string, persistence Persistence) error {
	doc, err := persistence.GetDocumentById(VIEW_COUNTER_DOC_ID, false)
	if err != nil {
		return err
	}

	viewCounter, ok := doc.Data.(map[string]interface{})
	if !ok {
		viewCounter = make(map[string]interface{})
	}

	shouldUpdatePersistence := false

	now := time.Now().UTC()
	currentDateStr := now.Format("2006-01-02")
	if dayEntry, dayEntryWasFound := viewCounter[currentDateStr]; dayEntryWasFound {
		dayEntry, _ := dayEntry.(map[string]interface{})
		if clientEntry, clientEntryWasFound := dayEntry[clientIP]; clientEntryWasFound {
			clientEntry, _ := clientEntry.(map[string]interface{})
			lastUpdatedStr, _ := clientEntry["lastUpdated"].(string)
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
		return persistence.ModifyDocumentById(VIEW_COUNTER_DOC_ID, viewCounter, doc.Rev)
	} else {
		return nil
	}
}

func addMessage(newMessage Message, chat *list.List) {
	chat.PushFront(newMessage)
}

func getMessages(chat *list.List) []Message {
	messages := make([]Message, chat.Len())
	for message := chat.Front(); message != nil; message = message.Next() {
		messages = append(messages, message.Value.(Message))
	}
	return messages
}

func getClientData(clientIP string) (interface{}, error) {
	url := fmt.Sprintf("https://ipapi.co/%s/json/", clientIP)
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

	var clientData map[string]string
	json.NewDecoder(resp.Body).Decode(&clientData)

	if _, found := clientData["error"]; found {
		return nil, fmt.Errorf("failed to get client data: %v", clientData)
	}

	return clientData, nil
}
