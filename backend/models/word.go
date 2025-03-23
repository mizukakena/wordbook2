package models

type Word struct {
	ID           int    `db:"id"`
	WordbookName string `db:"wordbook_name"`
	Word         string `db:"word"`
	Meaning      string `db:"meaning"`
}
