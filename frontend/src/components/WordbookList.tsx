"use client";

import React, { useState, useEffect } from "react";

// Wordbook型の定義
interface Wordbook {
  wordbook_name: string;
  num_of_words: number;
}

// APIレスポンスの型定義
interface ApiResponse {
  wordbooks: Wordbook[];
  error?: string;
}

const WordbookList: React.FC = () => {
  const [wordbooks, setWordbooks] = useState<Wordbook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/get-wordbooks")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`APIエラー: ${response.status}`);
        }
        return response.json();
      })
      .then((data: ApiResponse) => {
        console.log("API response:", data);

        if (data && Array.isArray(data.wordbooks)) {
          setWordbooks(data.wordbooks);
        } else {
          setError("予期しないAPIレスポンス形式です");
          setWordbooks([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching wordbooks:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error}</div>;
  }

  return (
    <div>
      <h1>単語帳一覧</h1>
      {wordbooks.length > 0 ? (
        <ul>
          {wordbooks.map((wordbook, index) => (
            <li key={index}>
              {wordbook.wordbook_name} ({wordbook.num_of_words}単語)
            </li>
          ))}
        </ul>
      ) : (
        <p>単語帳がありません。新しい単語帳を追加してください。</p>
      )}
    </div>
  );
};

export default WordbookList;
