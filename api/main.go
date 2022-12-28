package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func setupRouter(config MainConfig) *gin.Engine {
	UI_ROUTES := []string{"/", "/dev"}

	persistence, err := InitCloudantPersistence(config)
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
		SkynetHost:  config.SkynetHost,
	}

	if config.Mode == PRODUCTION {
		log.Println("Production mode is enabled.")
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	router.LoadHTMLGlob("templates/*.tmpl.html")
	router.Static("/static", "static")

	for _, route := range UI_ROUTES {
		router.GET(route, func(c *gin.Context) {
			go core.RecordView(c.ClientIP())
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
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid time interval, must be one of Daily, Weekly, Monthly, Yearly but was: %s", timeIntervalStr)})
			return
		}

		result, err := core.GetTrafficData(c.ClientIP(), timeInterval, intervals)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	})

	router.GET("/api/vision", func(c *gin.Context) {
		result, err := core.GetImageClassifierClasses()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	})

	router.POST("/api/vision", func(c *gin.Context) {
		multipartImage, err := c.FormFile("image")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		image, err := multipartImage.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		buffer := bytes.NewBuffer(nil)
		if _, err := io.Copy(buffer, image); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := os.MkdirAll("tmp", os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		imagePath := filepath.Join(".", "tmp", multipartImage.Filename)
		if err := c.SaveUploadedFile(multipartImage, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		result, err := core.ClassifyImage(imagePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	})

	return router
}

func main() {
	config := buildMainConfigFromEnvVars()
	router := setupRouter(config)
	router.Run(":" + config.Port)
}
