package handlers // Ensure this is at the top of the file

import (
	"github.com/gin-gonic/gin"
)

// HomeHandler serves the home page
func VocabHandler(c *gin.Context) {
	c.String(200, "This is the vocab controller.")
}
