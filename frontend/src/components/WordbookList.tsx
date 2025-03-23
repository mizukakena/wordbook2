"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from "@chakra-ui/react";

// Wordbook型の定義
export interface Wordbook {
  id: number; // IDを追加
  wordbook_name: string;
  num_of_words: number;
}

// APIレスポンスの型定義
interface ApiResponse {
  wordbooks: Wordbook[];
  error?: string;
}

interface WordbookListProps {
  onSelectWordbook?: (wordbook: Wordbook) => void;
}

const WordbookList: React.FC<WordbookListProps> = ({ onSelectWordbook }) => {
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

  const handleWordbookClick = (wordbook: Wordbook) => {
    if (onSelectWordbook) {
      onSelectWordbook(wordbook);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        エラーが発生しました: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Heading as="h2" size="md" mb={4} textAlign="center">
        単語帳一覧
      </Heading>
      {wordbooks.length > 0 ? (
        <UnorderedList styleType="none" ml={0}>
          {wordbooks.map((wordbook) => (
            <ListItem key={wordbook.id} mb={2} textAlign="center">
              <Button
                height="100px"
                backgroundColor={"#fff"}
                variant="outline"
                justifyContent="space-between"
                width="80%"
                onClick={() => handleWordbookClick(wordbook)}
                py={3}
                px={4}
                textAlign="left"
                fontWeight="normal"
                _hover={{ bg: "blue.50" }}
              >
                <Text>{wordbook.wordbook_name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {wordbook.num_of_words}単語
                </Text>
              </Button>
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <Text>単語帳がありません。新しい単語帳を追加してください。</Text>
      )}
    </Box>
  );
};

export default WordbookList;
