package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	// "time"
)

type Exhibit struct {
	Name   string   `json:"name"`
	Description   string   `json:"description"`
    
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

func getExhibits() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.String(http.StatusOK, "Test")
	}
}

func main() {
	port := os.Getenv("PORT")

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

	router.GET("/api/art", getExhibits())

	router.Run(":" + port)
}
