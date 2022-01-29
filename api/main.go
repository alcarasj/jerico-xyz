package main

import (
	"container/list"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

const PRODUCTION = "PRODUCTION"
const DB_NAME = "jerico-xyz"

func main() {
	MODE := os.Getenv("MODE")
	PORT := os.Getenv("PORT")
	S3_HOST := os.Getenv("S3_HOST")
	BUCKET_NAME := os.Getenv("BUCKET_NAME")
	IBM_CLOUD_API_KEY := os.Getenv("IBM_CLOUD_API_KEY")
	IBM_CLOUD_IAM_TOKEN_ENDPOINT := os.Getenv("IBM_CLOUD_IAM_TOKEN_ENDPOINT")
	CLOUDANT_HOST := os.Getenv("CLOUDANT_HOST")
	UI_ROUTES := []string{"/", "/dev"}

	if PORT == "" || S3_HOST == "" || BUCKET_NAME == "" || IBM_CLOUD_API_KEY == "" || CLOUDANT_HOST == "" || IBM_CLOUD_IAM_TOKEN_ENDPOINT == "" {
		log.Fatal("PORT, BUCKET_NAME, IBM_CLOUD_API_KEY, CLOUDANT_HOST, IBM_CLOUD_IAM_TOKEN_ENDPOINT and S3_HOST must be set!")
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

	cache := NewCache()
	chat := list.New()
	persistence, err := InitPersistence(DB_NAME, IBM_CLOUD_API_KEY, CLOUDANT_HOST, IBM_CLOUD_IAM_TOKEN_ENDPOINT)
	if err != nil {
		log.Fatal(err.Error())
	}
	err = persistence.GetDatabaseInfo()
	if err != nil {
		log.Fatal(err.Error())
	}

	for _, route := range UI_ROUTES {
		router.GET(route, func(c *gin.Context) {
			c.HTML(http.StatusOK, "index.tmpl.html", gin.H{"bundleURL": getBundleURL(BUCKET_URL, MODE)})
		})
	}

	router.GET("/api/client", func(c *gin.Context) {
		address := c.ClientIP()
		getCall := func() (interface{}, error) { return getClientData(address) }

		clientDataInterface, err := cache.Get(address, getCall)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		clientData, ok := clientDataInterface.(map[string]string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse client data"})
			return
		}

		var location string
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
		c.JSON(http.StatusOK, gin.H{"messages": getMessages(chat)})
	})

	router.POST("/api/chat", func(c *gin.Context) {
		c.JSON(http.StatusCreated, gin.H{"messages": getMessages(chat)})
	})

	router.GET("/api/views", func(c *gin.Context) {
		views, err := persistence.GetDocumentById(VIEW_COUNTER_DOC_ID, true)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"views": views})
	})

	router.POST("/api/views", func(c *gin.Context) {
		address := c.ClientIP()
		err := recordView(address, *persistence)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		views, err := persistence.GetDocumentById(VIEW_COUNTER_DOC_ID, true)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"views": views})
	})

	router.Run(":" + PORT)
}
