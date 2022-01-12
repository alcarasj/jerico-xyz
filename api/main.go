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

const PRODUCTION = "PRODUCTION"

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

func main() {
	MODE := os.Getenv("MODE")
	PORT := os.Getenv("PORT")
	S3_HOST := os.Getenv("S3_HOST")
	BUCKET_NAME := os.Getenv("BUCKET_NAME")

	if PORT == "" || S3_HOST == "" || BUCKET_NAME == "" {
		log.Fatal("PORT, BUCKET_NAME and S3_HOST must be set!")
	}
	if MODE == PRODUCTION {
		log.Println("Production mode is enabled.")
		gin.SetMode(gin.ReleaseMode)
	}

	BUCKET_URL := fmt.Sprintf("%s/%s", S3_HOST, BUCKET_NAME)
	router := gin.New()
	router.Use(gin.Logger())
	router.LoadHTMLGlob("templates/*.tmpl.html")
	router.Static("/static", "static")

	router.GET("/", func(c *gin.Context) {
		serveReactBundle(c, BUCKET_URL, MODE)
	})

	router.GET("/dev", func(c *gin.Context) {
		serveReactBundle(c, BUCKET_URL, MODE)
	})

	router.GET("/client", func(c *gin.Context) {
		address := c.ClientIP()

		res, err := http.Get(fmt.Sprintf("https://ipapi.co/%s/json/", address))
		if err != nil {
			log.Fatal(err)
		}

		var clientData map[string]string
		var location string
		json.NewDecoder(res.Body).Decode(&clientData)

		if clientData["city"] != "" && clientData["region"] != "" && clientData["country_name"] != "" {
			location = fmt.Sprintf("%s, %s, %s", clientData["city"], clientData["region"], clientData["country_name"])
		} else {
			location = ""
		}

		c.JSON(http.StatusOK, gin.H{
			"address":  address,
			"location": location,
		})
	})

	router.GET("/api/art", func(c *gin.Context) {
		exhibits := []Exhibit{
			Exhibit{
				Name:        "Velocity",
				Description: "test",
				DateCreated: "November 2020",
				Collection:  "Geometric",
				ImageURL:    fmt.Sprintf("%s/Velocity50pc.png", BUCKET_URL),
			},
			Exhibit{
				Name:        "Unity",
				Description: "test",
				DateCreated: "November 2020",
				Collection:  "Geometric",
				ImageURL:    fmt.Sprintf("%s/Unity50pc.png", BUCKET_URL),
			},
		}
		c.JSON(http.StatusOK, gin.H{"exhibits": exhibits})
	})

	router.Run(":" + PORT)
}
