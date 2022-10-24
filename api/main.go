package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	UI_ROUTES := []string{"/", "/dev"}
	config := buildMainConfigFromEnvVars()

	if config.Mode == PRODUCTION {
		log.Println("Production mode is enabled.")
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.LoadHTMLGlob("templates/*.tmpl.html")
	router.Static("/static", "static")

	persistence, err := InitPersistence(config)
	if err != nil {
		log.Fatal(err.Error())
	}

	err = persistence.GetDatabaseInfo()
	if err != nil {
		log.Fatal(err.Error())
	}
	core := Core{
		Persistence: *persistence,
		Cache:       NewCache(),
	}

	for _, route := range UI_ROUTES {
		router.GET(route, func(c *gin.Context) {
			core.RecordView(c.ClientIP())
			c.HTML(http.StatusOK, "index.tmpl.html", gin.H{"bundleURL": getBundleURL(config.S3BucketURL, config.Mode)})
		})
	}

	router.GET("/api/client", func(c *gin.Context) {
		ip := c.ClientIP()
		result, err := core.GetClientData(ip)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	})

	router.GET("/api/art", func(c *gin.Context) {
		exhibits := []Exhibit{
			{
				Name:        "Velocity",
				Description: "test",
				DateCreated: "November 2020",
				Collection:  "Geometric",
				ImageURL:    fmt.Sprintf("%s/Velocity50pc.png", config.S3BucketURL),
			},
			{
				Name:        "Unity",
				Description: "test",
				DateCreated: "November 2020",
				Collection:  "Geometric",
				ImageURL:    fmt.Sprintf("%s/Unity50pc.png", config.S3BucketURL),
			},
		}
		c.JSON(http.StatusOK, exhibits)
	})

	router.GET("/api/traffic", func(c *gin.Context) {
		intervals, _ := strconv.Atoi(c.Query("intervals"))
		timeIntervalStr := c.Query("timeInterval")
		timeInterval, ok := stringToTimeInterval(timeIntervalStr)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid time interval, must be one of Daily, Weekly but was: %s", timeIntervalStr)})
			return
		}

		result, err := core.GetTrafficData(c.ClientIP(), timeInterval, intervals)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	})

	router.Run(":" + config.Port)
}
