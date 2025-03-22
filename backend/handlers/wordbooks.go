package handlers

import (
	"context"
	"log"
	"net/http"
	"wordbook2/config"

	"github.com/gin-gonic/gin"
)

type SaveWordbookRequest struct {
	WordbookName string `json:"wordbook_name"`
}

func WordbookHandler(c *gin.Context) {
	c.String(200, "This is the wordbook controller.")
}

// ✅ Handle form submission and save the wordbook
func SaveWordbook(c *gin.Context) {
	var req SaveWordbookRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := config.DB.Exec(context.Background(),
		"INSERT INTO wordbook (wordbook_name, num_of_words) VALUES ($1, 0)",
		req.WordbookName,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert wordbook"})
		return
	}

	// Return success JSON
	c.JSON(http.StatusOK, gin.H{
		"message":       "Wordbook added successfully",
		"wordbook_name": req.WordbookName,
	})
}

func GetWordbooks(c *gin.Context) {
	log.Println("GetWordbooks() called...")

	// 1) Try selecting from the actual table.
	rows, err := config.DB.Query(context.Background(), "SELECT wordbook_name, num_of_words FROM public.wordbook")
	if err != nil {
		log.Println("❌ Query error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "Failed to fetch wordbooks",
			"detail": err.Error(),
		})
		return
	}
	defer rows.Close()

	log.Println("✅ Query successful! Processing results...")

	// 2) Scan the results
	var wordbooks []map[string]interface{}
	for rows.Next() {
		var name string
		var count int
		if err := rows.Scan(&name, &count); err != nil {
			log.Println("❌ Error scanning row:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning row"})
			return
		}
		wordbooks = append(wordbooks, map[string]interface{}{
			"wordbook_name": name,
			"num_of_words":  count,
		})
	}
	log.Println("✅ Wordbooks retrieved successfully:", wordbooks)

	// 3) Return JSON response
	c.JSON(http.StatusOK, gin.H{"wordbooks": wordbooks})
}
