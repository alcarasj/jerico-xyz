package main

import (
	"container/list"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

const PRODUCTION = "PRODUCTION"

func main() {
	MODE := os.Getenv("MODE")
	PORT := os.Getenv("PORT")
	S3_HOST := os.Getenv("S3_HOST")
	BUCKET_NAME := os.Getenv("BUCKET_NAME")
	CHAT := list.New()
	VIEW_COUNTER := make(ViewCounter)

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

	router.GET("api/client", func(c *gin.Context) {
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
			{
				Name:        "Velocity",
				Description: "test",
				DateCreated: "November 2020",
				Collection:  "Geometric",
				ImageURL:    fmt.Sprintf("%s/Velocity50pc.png", BUCKET_URL),
			},
			{
				Name:        "Unity",
				Description: "test",
				DateCreated: "November 2020",
				Collection:  "Geometric",
				ImageURL:    fmt.Sprintf("%s/Unity50pc.png", BUCKET_URL),
			},
		}
		c.JSON(http.StatusOK, gin.H{"exhibits": exhibits})
	})

	router.GET("/api/chat", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"messages": getMessages(CHAT)})
	})

	router.POST("/api/chat", func(c *gin.Context) {
		c.JSON(http.StatusCreated, gin.H{"messages": getMessages(CHAT)})
	})

	router.GET("/api/views", func(c *gin.Context) {
		c.JSON(http.StatusCreated, gin.H{"views": VIEW_COUNTER})
	})

	router.POST("/api/views", func(c *gin.Context) {
		address := c.ClientIP()
		addView(VIEW_COUNTER, address)
		c.JSON(http.StatusCreated, gin.H{"views": VIEW_COUNTER})
	})

	router.Run(":" + PORT)
}
