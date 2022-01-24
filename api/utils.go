package main

import (
	"container/list"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func getPackageVersion() string {
	jsonFile, error := os.Open("package.json")
	if error != nil {
		fmt.Println(error)
	}
	defer jsonFile.Close()
	byteValue, _ := ioutil.ReadAll(jsonFile)

	var result map[string]interface{}
	json.Unmarshal([]byte(byteValue), &result)
	return result["version"].(string)
}

func serveReactBundle(c *gin.Context, bucketURL string, mode string) {
	var bundleURL string
	packageVersion := getPackageVersion()
	if mode == PRODUCTION {
		bundleURL = fmt.Sprintf("%s/bundle/main-%s.js", bucketURL, packageVersion)
	} else {
		bundleURL = fmt.Sprintf("./static/bundle/bundle-%s/main.js", packageVersion)
	}
	c.HTML(http.StatusOK, "index.tmpl.html", gin.H{
		"bundleURL": bundleURL,
	})
}

func addView(viewCounter ViewCounter, clientIP string) {
	now := time.Now().UTC()
	currentDateStr := now.Format("2006-01-02")
	if dayEntry, dayEntryWasFound := viewCounter[currentDateStr]; dayEntryWasFound {
		if clientEntry, clientEntryWasFound := dayEntry[clientIP]; clientEntryWasFound {
			if now.Sub(clientEntry.LastUpdated).Seconds() > 10 {
				clientEntry.Views = clientEntry.Views + 1
				clientEntry.LastUpdated = now
			}
		} else {
			newClientEntry := ViewCounterClientEntry{
				Views:       0,
				LastUpdated: now,
			}
			dayEntry[clientIP] = &newClientEntry
		}
	} else {
		newDayEntry := make(ViewCounterDayEntry)
		newDayEntry[clientIP] = &ViewCounterClientEntry{
			Views:       1,
			LastUpdated: time.Now().UTC(),
		}
		viewCounter[currentDateStr] = newDayEntry
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
