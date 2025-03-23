package handlers

import (
	"bytes"
	"context"
	"io"
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

	// リクエストボディのログ出力（デバッグ用）
	body, _ := io.ReadAll(c.Request.Body)
	c.Request.Body = io.NopCloser(bytes.NewBuffer(body))
	log.Printf("Request body: %s", string(body))

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("❌ JSON binding error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("✅ Received request to save wordbook: %s", req.WordbookName)

	// user_emailの処理（一時的に固定値を使用）
	userEmail := "test@example.com" // テスト用の固定値

	// SQLクエリの実行
	_, err := config.DB.Exec(context.Background(),
		"INSERT INTO wordbook (wordbook_name, user_email, num_of_words) VALUES ($1, $2, 0)",
		req.WordbookName, userEmail,
	)
	if err != nil {
		log.Printf("❌ Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "Failed to insert wordbook",
			"detail": err.Error(),
		})
		return
	}

	log.Println("✅ Wordbook added successfully")

	// 成功レスポンス
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

// handlers/delete_wordbook.go
func DeleteWordbook(c *gin.Context) {
	wordbookName := c.Param("name")

	query := "DELETE FROM wordbook WHERE wordbook_name = $1"
	_, err := config.DB.Exec(context.Background(), query, wordbookName)
	if err != nil {
		c.JSON(500, gin.H{"error": "単語帳の削除に失敗しました"})
		return
	}

	c.JSON(200, gin.H{"message": "単語帳を削除しました"})
}
