package handlers

import (
	"context"
	"log"
	"net/http"
	"strconv"
	"wordbook2/config"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type AddWordRequest struct {
	WordbookName string `json:"wordbook_name"` // フロントエンドとの互換性のために残す
	WordbookID   int    `json:"wordbook_id"`   // 新しく追加
	Word         string `json:"word"`
	Meaning      string `json:"meaning"`
}

// AddWord は単語を追加するハンドラー関数
func AddWord(c *gin.Context) {
	var req AddWordRequest

	// リクエストのJSONをバインド
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("❌ JSON binding error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// WordbookIDが指定されていない場合は、WordbookNameから取得
	if req.WordbookID == 0 && req.WordbookName != "" {
		var wordbookID int
		err := config.DB.QueryRow(context.Background(),
			"SELECT id FROM wordbook WHERE wordbook_name = $1",
			req.WordbookName,
		).Scan(&wordbookID)
		if err != nil {
			log.Printf("❌ Failed to find wordbook: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Wordbook not found"})
			return
		}
		req.WordbookID = wordbookID
	}

	log.Printf("✅ Received request to add word: %s to wordbook ID: %d", req.Word, req.WordbookID)

	// トランザクション開始
	tx, err := config.DB.Begin(context.Background())
	if err != nil {
		log.Printf("❌ Failed to begin transaction: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to begin transaction"})
		return
	}
	defer tx.Rollback(context.Background())

	// 1. 単語を追加
	_, err = tx.Exec(context.Background(),
		"INSERT INTO word (wordbook_id, word, meaning) VALUES ($1, $2, $3)",
		req.WordbookID, req.Word, req.Meaning,
	)
	if err != nil {
		log.Printf("❌ Failed to insert word: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "Failed to insert word",
			"detail": err.Error(),
		})
		return
	}

	// 2. 単語帳の単語数を更新
	_, err = tx.Exec(context.Background(),
		"UPDATE wordbook SET num_of_words = num_of_words + 1 WHERE id = $1",
		req.WordbookID,
	)
	if err != nil {
		log.Printf("❌ Failed to update wordbook count: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "Failed to update wordbook count",
			"detail": err.Error(),
		})
		return
	}

	// トランザクションをコミット
	if err := tx.Commit(context.Background()); err != nil {
		log.Printf("❌ Failed to commit transaction: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	// 単語帳名を取得（レスポンス用）
	var wordbookName string
	err = config.DB.QueryRow(context.Background(),
		"SELECT wordbook_name FROM wordbook WHERE id = $1",
		req.WordbookID,
	).Scan(&wordbookName)
	if err != nil {
		log.Printf("❌ Warning: Could not fetch wordbook name: %v", err)
		wordbookName = "Unknown"
	}

	log.Println("✅ Word added successfully")

	// 成功レスポンス
	c.JSON(http.StatusOK, gin.H{
		"message":       "Word added successfully",
		"wordbook_id":   req.WordbookID,
		"wordbook_name": wordbookName,
		"word":          req.Word,
		"meaning":       req.Meaning,
	})
}

// GetWords は特定の単語帳の単語一覧を取得するハンドラー関数
func GetWords(c *gin.Context) {
	wordbookIDStr := c.Query("wordbook_id")
	wordbookName := c.Query("wordbook_name")

	var wordbookID int
	var err error

	if wordbookIDStr != "" {
		wordbookID, err = strconv.Atoi(wordbookIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid wordbook_id"})
			return
		}
	} else if wordbookName != "" {
		// 単語帳名からIDを取得
		err = config.DB.QueryRow(context.Background(),
			"SELECT id FROM wordbook WHERE wordbook_name = $1",
			wordbookName,
		).Scan(&wordbookID)
		if err != nil {
			log.Printf("❌ Failed to find wordbook: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Wordbook not found"})
			return
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "wordbook_id or wordbook_name is required"})
		return
	}

	log.Printf("Fetching words for wordbook ID: %d", wordbookID)

	rows, err := config.DB.Query(context.Background(),
		"SELECT w.id, wb.wordbook_name, w.word, w.meaning FROM word w "+
			"JOIN wordbook wb ON w.wordbook_id = wb.id "+
			"WHERE w.wordbook_id = $1",
		wordbookID,
	)
	if err != nil {
		log.Printf("❌ Query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "Failed to fetch words",
			"detail": err.Error(),
		})
		return
	}
	defer rows.Close()

	var words []map[string]interface{}
	for rows.Next() {
		var id int
		var wordbookName, word, meaning string
		if err := rows.Scan(&id, &wordbookName, &word, &meaning); err != nil {
			log.Printf("❌ Error scanning row: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning row"})
			return
		}
		words = append(words, map[string]interface{}{
			"id":            id,
			"wordbook_name": wordbookName,
			"word":          word,
			"meaning":       meaning,
		})
	}

	log.Printf("✅ Retrieved %d words for wordbook ID: %d", len(words), wordbookID)
	c.JSON(http.StatusOK, gin.H{"words": words})
}

// GetRandomWord は特定の単語帳からランダムに単語を1つ取得するハンドラー関数
func GetRandomWord(c *gin.Context) {
	wordbookIDStr := c.Query("wordbook_id")
	
	if wordbookIDStr == "" {
		log.Printf("❌ wordbook_id is missing")
		c.JSON(http.StatusBadRequest, gin.H{"error": "wordbook_id is required"})
		return
	}
	
	wordbookID, err := strconv.Atoi(wordbookIDStr)
	if err != nil {
		log.Printf("❌ Invalid wordbook_id: %s", wordbookIDStr)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid wordbook_id"})
		return
	}

	log.Printf("✅ Fetching random word for wordbook ID: %d", wordbookID)

	// まず、単語帳に単語が存在するか確認
	var count int
	err = config.DB.QueryRow(context.Background(),
		"SELECT COUNT(*) FROM word WHERE wordbook_id = $1",
		wordbookID,
	).Scan(&count)
	
	if err != nil {
		log.Printf("❌ Error counting words: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count words"})
		return
	}
	
	log.Printf("✅ Found %d words in wordbook ID: %d", count, wordbookID)
	
	if count == 0 {
		log.Printf("❌ No words found in wordbook ID: %d", wordbookID)
		c.JSON(http.StatusNotFound, gin.H{"error": "No words found in this wordbook"})
		return
	}

	// ランダムに単語を1つ取得
	var id int
	var word, meaning string
	err = config.DB.QueryRow(context.Background(),
		"SELECT id, word, meaning FROM word WHERE wordbook_id = $1 ORDER BY RANDOM() LIMIT 1",
		wordbookID,
	).Scan(&id, &word, &meaning)
	
	if err != nil {
		if err == pgx.ErrNoRows {
			log.Printf("❌ No words found in wordbook ID: %d (unexpected)", wordbookID)
			c.JSON(http.StatusNotFound, gin.H{"error": "No words found in this wordbook"})
			return
		}
		log.Printf("❌ Query error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "Failed to fetch random word",
			"detail": err.Error(),
		})
		return
	}

	log.Printf("✅ Retrieved random word: %s for wordbook ID: %d", word, wordbookID)
	c.JSON(http.StatusOK, gin.H{
		"id":      id,
		"word":    word,
		"meaning": meaning,
	})
}

