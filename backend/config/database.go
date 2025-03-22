package config

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
)

var DB *pgx.Conn // Global variable for database connection

func ConnectDatabase() {
	// ✅ PostgreSQL Connection String: (adjust user/password as needed)
	dsn := "postgres://postgres:Kouki%2F0202@localhost:5432/wordbook_db"

	// ✅ Connect to the database
	conn, err := pgx.Connect(context.Background(), dsn)
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}
	// ✅ Store the connection in a global variable
	DB = conn

	// ✅ Check which database and schema we connected to
	var dbName, schemaName string
	err = DB.QueryRow(context.Background(), "SELECT current_database()").Scan(&dbName)
	if err != nil {
		log.Fatal("❌ Failed to get database name:", err)
	}
	log.Println("✅ Connected to database:", dbName)

	err = DB.QueryRow(context.Background(), "SELECT current_schema()").Scan(&schemaName)
	if err != nil {
		log.Fatal("❌ Failed to get schema name:", err)
	}
	log.Println("✅ Using schema:", schemaName)

	fmt.Println("✅ Connected to PostgreSQL database (postgres)")
}
