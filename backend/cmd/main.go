package main

import (
	"fmt"
	"wordbook2/config"
	"wordbook2/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()
	// Create a new Gin router
	r := gin.Default()

	// CORS追加
	r.Use(cors.Default())
	// r.LoadHTMLGlob("templates/*")
	r.Static("/static", ".frontend/build")

	// Define a simple GET route
	// r.GET("/", handlers.HomeHandler)
	r.GET("/get-wordbooks", handlers.GetWordbooks)
	r.GET("/user", handlers.UserHandler)
	r.GET("/vocab", handlers.VocabHandler)
	r.GET("/wordbook", handlers.WordbookHandler)
	r.GET("/add-wordbook", handlers.WordbookIndex)
	r.POST("/save-wordbook", handlers.SaveWordbook)
	
	// 単語関連のエンドポイントを追加
	r.POST("/add-word", handlers.AddWord)
	r.GET("/get-words", handlers.GetWords)
	r.GET("/get-random-word", handlers.GetRandomWord)
	r.POST("/add-wordbook", handlers.SaveWordbook)
	
	// AI生成関連のエンドポイントは必要になったら追加する
	// r.POST("/generate-words", handlers.GenerateWords)

	// Start the server on port 8080
	fmt.Println("Server started at http://localhost:8080")
	if err := r.Run(":8080"); err != nil { // This starts the HTTP server
		fmt.Printf("Failed to start server: %v\n", err)
	}
}

