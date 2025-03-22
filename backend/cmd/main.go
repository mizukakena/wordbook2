package main

import (
	"fmt"
	"wordbook2/config"
	"wordbook2/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()
	// Create a new Gin router
	r := gin.Default()

	r.LoadHTMLGlob("templates/*")

	// Define a simple GET route
	r.GET("/", handlers.HomeHandler)
	r.GET("/get-wordbooks", handlers.GetWordbooks)
	r.GET("/user", handlers.UserHandler)
	r.GET("/vocab", handlers.VocabHandler)
	r.GET("/wordbook", handlers.WordbookHandler)
	r.GET("/add-wordbook", handlers.WordbookIndex)
	r.POST("/save-wordbook", handlers.SaveWordbook)

	// Start the server on port 8080
	fmt.Println("Server started at http://localhost:8080")
	if err := r.Run(":8080"); err != nil { // This starts the HTTP server
		fmt.Printf("Failed to start server: %v\n", err)
	}
}
