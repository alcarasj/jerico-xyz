package main

import (
	"log"
	"net/http"
	"os"
	"fmt"
	"io/ioutil"
	"encoding/json"
	"github.com/gin-gonic/gin"
	_ "github.com/heroku/x/hmetrics/onload"
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

	router.Run(":" + port)
}
