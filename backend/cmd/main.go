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
	r.DELETE("/api/delete-wordbook/:name", handlers.DeleteWordbook)
	r.POST("/save-wordbook", handlers.SaveWordbook)
	
	// 単語関連のエンドポイントを追加
	r.POST("/add-word", handlers.AddWord)
	r.GET("/get-words", handlers.GetWords)
	r.GET("/get-random-word", handlers.GetRandomWord)
	r.POST("/add-wordbook", handlers.SaveWordbook)
	
	// AI生成関連のエンドポイントは必要になったら追加する
	// r.POST("/generate-words", handlers.GenerateWords)

	fmt.Println("Go API server started at http://localhost:8080")
	log.Fatal(r.Run(":8080"))
}

