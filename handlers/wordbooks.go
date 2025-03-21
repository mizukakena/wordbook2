package handlers

import (
	"net/http"
	"wordbook2/config"
	"wordbook2/models"

	"github.com/gin-gonic/gin"
)

func WordbookHandler(c *gin.Context) {
	c.String(200, "This is the wordbook controller.")
}

// ✅ Show the "Add Wordbook" page
func WordbookIndex(c *gin.Context) {
	c.HTML(200, "addWordbook.html", gin.H{})
}

// ✅ Handle form submission and save the wordbook
func SaveWordbook(c *gin.Context) {
	var input models.Wordbook

	// Bind form data to struct
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save to PostgreSQL
	_, err := config.DB.Exec(c, "INSERT INTO wordbooks (name) VALUES ($1)", input.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save wordbook"})
		return
	}

	// Redirect back to home page after saving
	c.Redirect(http.StatusFound, "/")
}
