package main

import (
	"fmt"
	"log"
	"wordbook2/config"
	"wordbook2/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()

	r := gin.Default()

	// CORS for frontend
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Content-Type"},
	}))

	// Only JSON API endpoints
	r.GET("/api/get-wordbooks", handlers.GetWordbooks)
	r.POST("/api/save-wordbook", handlers.SaveWordbook)

	fmt.Println("Go API server started at http://localhost:8080")
	log.Fatal(r.Run(":8080"))
}
