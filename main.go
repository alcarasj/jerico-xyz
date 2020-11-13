package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
)

const CREATE_EXHIBITS_TABLE = "CREATE TABLE IF NOT EXISTS exhibits(" +
	"name PRIMARY KEY," +
	"description TEXT," +
	"date_created DATE," +
	"image_url TEXT" +
	");"

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

func getExhibits(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		if _, err := db.Exec(CREATE_EXHIBITS_TABLE); err != nil {
			c.String(http.StatusInternalServerError,
				fmt.Sprintf("Error creating database table: %q", err))
			return
		}

		rows, err := db.Query("SELECT * FROM exhibits")
		if err != nil {
			c.String(http.StatusInternalServerError, fmt.Sprintf("Error reading ticks: %q", err))
			return
		}

		defer rows.Close()
		for rows.Next() {
			var tick time.Time
			if err := rows.Scan(&tick); err != nil {
				c.String(http.StatusInternalServerError, fmt.Sprintf("Error scanning ticks: %q", err))
				return
			}
			c.String(http.StatusOK, fmt.Sprintf("Read from DB: %s\n", tick.String()))
		}
	}
}

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	database, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Error opening database: %q", err)
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

	router.GET("/api/art", getExhibits(database))

	router.Run(":" + port)
}
