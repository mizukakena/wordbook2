package handlers

import (
	"github.com/gin-gonic/gin"
)

// HomeHandler handles the home route "/"
func HomeHandler(c *gin.Context) {
	c.HTML(200, "home.html", gin.H{})
}
