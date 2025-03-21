package config

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
)

var DB *pgx.Conn // Global variable for database connection

func ConnectDatabase() {
	// ✅ PostgreSQL Connection String (Change credentials if needed)
	dsn := "postgres://yuma:yuma@localhost:5432/wordbook_db"

	// ✅ Connect to the database
	conn, err := pgx.Connect(context.Background(), dsn)
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// ✅ Store the connection in a global variable
	DB = conn

	fmt.Println("✅ Connected to PostgreSQL database")
}
