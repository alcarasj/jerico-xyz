package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type Exhibit struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	DateCreated string `json:"dateCreated"`
	Collection  string `json:"collection"`
	ImageURL    string `json:"imageURL"`
}

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

func main() {
	port := os.Getenv("PORT")
	bucketHost := os.Getenv("BUCKET_HOST")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.LoadHTMLGlob("templates/*.tmpl.html")
	router.Static("/static", "static")

	router.GET("/", func(c *gin.Context) {
		packageVersion := getPackageVersion()
		c.HTML(http.StatusOK, "index.tmpl.html", gin.H{
			"packageVersion": packageVersion,
		})
	})

	router.GET("/api/art", func(c *gin.Context) {
		exhibits := []Exhibit{
			Exhibit{
				Name:        "Velocity",
				Description: "test",
				DateCreated: "November 2020",
				Collection:  "Geometric",
				ImageURL:    fmt.Sprintf("%s/Velocity50pc.png", bucketHost),
			},
			Exhibit{
				Name:        "Unity",
				Description: "test",
				DateCreated: "November 2020",
				Collection:  "Geometric",
				ImageURL:    fmt.Sprintf("%s/Unity50pc.png", bucketHost),
			},
		}
		c.JSON(http.StatusOK, gin.H{"exhibits": exhibits})
	})

	router.Run(":" + port)
}
