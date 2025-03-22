package models

type Wordbook struct {
	WordbookName string `db:"wordbook_name"`
	UserEmail    string `db:"user_email"`
	NumOfWords   int    `db:"num_of_words"`
}
