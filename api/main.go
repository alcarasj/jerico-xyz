package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	UI_ROUTES := []string{"/", "/dev"}
	config := buildCoreConfigFromEnvVars()

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
		location, err := core.GetClientData(ip)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"address":  ip,
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
		views, err := core.GetTrafficData(c.ClientIP())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, views)
	})

	router.Run(":" + config.Port)
}
