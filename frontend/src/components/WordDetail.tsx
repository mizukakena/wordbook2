"use client";

import type React from "react";
import { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
  Divider,
  useToast,
  Code,
} from "@chakra-ui/react";
import type { Wordbook } from "./WordbookList";

interface WordDetailProps {
  wordbook: Wordbook | null;
  onWordAdded?: () => void;
}

export interface Word {
  word: string;
  meaning: string;
}

const WordDetail: React.FC<WordDetailProps> = ({ wordbook, onWordAdded }) => {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAddedWord, setLastAddedWord] = useState<{
    word: string;
    meaning: string;
  } | null>(null);
  const toast = useToast();

  if (!wordbook) {
    return (
      <Box p={4} borderWidth={1} borderRadius="lg">
        <Text>左側の単語帳リストから単語帳を選択してください。</Text>
      </Box>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(
        `Adding word to wordbook ID: ${wordbook.id}, Name: ${wordbook.wordbook_name}`
      );

      const requestBody = {
        wordbook_name: wordbook.wordbook_name,
        wordbook_id: wordbook.id,
        word: word,
        meaning: meaning,
      };

      console.log("Request body:", requestBody);

      const response = await fetch("http://localhost:8080/add-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`Response status: ${response.status}`);
      const responseText = await response.text();
      console.log(`Response text: ${responseText}`);

      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log("Parsed response:", data);

      setLastAddedWord({ word, meaning });

      toast({
        title: "単語を追加しました",
        description: `「${word}」を単語帳「${wordbook.wordbook_name}」に追加しました`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // フォームをリセット
      setWord("");
      setMeaning("");

      // 親コンポーネントに通知
      if (onWordAdded) {
        onWordAdded();
      }
    } catch (error) {
      console.error("Error adding word:", error);
      toast({
        title: "エラーが発生しました",
        description:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" backgroundColor="#fff">
      <Heading as="h2" size="md" mb={2} color="#000">
        {wordbook.wordbook_name} (ID: {wordbook.id})
      </Heading>
      <Text mb={4} color="gray.600">
        現在の単語数: {wordbook.num_of_words}
      </Text>
      <Divider my={4} />

      <Heading as="h3" size="sm" mb={4} color="#000">
        新しい単語を追加
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel htmlFor="word" color="#000">
              単語:
            </FormLabel>
            <Input
              color="#000"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="例: apple"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="meaning" color="#000">
              意味:
            </FormLabel>
            <Input
              color="#000"
              id="meaning"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="例: りんご"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="追加中..."
            isDisabled={loading || !word || !meaning}
          >
            単語を追加
          </Button>
        </VStack>
      </form>

      {lastAddedWord && (
        <Box mt={4} p={3} bg="green.50" borderRadius="md">
          <Text fontWeight="bold">最後に追加した単語:</Text>
          <Text>単語: {lastAddedWord.word}</Text>
          <Text>意味: {lastAddedWord.meaning}</Text>
          <Code mt={2} fontSize="xs">
            デバッグ情報: Wordbook ID: {wordbook.id}
          </Code>
        </Box>
      )}
    </Box>
  );
};

export default WordDetail;
