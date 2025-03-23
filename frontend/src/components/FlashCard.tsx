"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  useToast,
  Flex,
  Card,
  CardBody,
  Code,
} from "@chakra-ui/react";
import { RefreshCw } from "lucide-react";
import type { Wordbook } from "./WordbookList";

interface FlashCardProps {
  wordbook: Wordbook | null;
}

export interface Word {
  id: number;
  word: string;
  meaning: string;
}

const FlashCard: React.FC<FlashCardProps> = ({ wordbook }) => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [showMeaning, setShowMeaning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchRandomWord = async () => {
    if (!wordbook) return;

    setLoading(true);
    setShowMeaning(false);
    setError(null);

    try {
      console.log(`Fetching random word for wordbook ID: ${wordbook.id}`);
      const response = await fetch(
        `http://localhost:8080/get-random-word?wordbook_id=${wordbook.id}`
      );

      console.log(`Response status: ${response.status}`);
      const responseText = await response.text();
      console.log(`Response text: ${responseText}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("この単語帳にはまだ単語が登録されていません。");
          setCurrentWord(null);
          return;
        }
        throw new Error(`APIエラー: ${response.status} - ${responseText}`);
      }

      // テキストからJSONに変換
      const data = JSON.parse(responseText);
      console.log("Parsed data:", data);
      setCurrentWord(data);
    } catch (error) {
      console.error("Error fetching random word:", error);
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
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

  // 単語帳が選択されたら単語を取得
  useEffect(() => {
    if (wordbook) {
      console.log(
        `Selected wordbook: ${wordbook.wordbook_name} (ID: ${wordbook.id})`
      );
      fetchRandomWord();
    } else {
      setCurrentWord(null);
    }
  }, [wordbook]);

  // 単語カードをクリックしたときの処理
  const handleCardClick = () => {
    setShowMeaning(!showMeaning);
  };

  // 次の単語を取得
  const handleNextWord = () => {
    fetchRandomWord();
  };

  if (!wordbook) {
    return (
      <Box p={4} borderWidth={1} borderRadius="lg">
        <Text>左側の単語帳リストから単語帳を選択してください。</Text>
      </Box>
    );
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" backgroundColor="#eee">
      <Heading as="h2" size="md" mb={4} color="#000">
        フラッシュカード: {wordbook.wordbook_name} (ID: {wordbook.id})
      </Heading>

      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : currentWord ? (
        <VStack spacing={4} align="stretch">
          <Card
            minH="200px"
            onClick={handleCardClick}
            cursor="pointer"
            _hover={{ boxShadow: "md" }}
            transition="all 0.2s"
          >
            <CardBody
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Heading size="lg" mb={4}>
                {currentWord.word}
              </Heading>

              {showMeaning ? (
                <Text fontSize="xl" color="blue.600">
                  {currentWord.meaning}
                </Text>
              ) : (
                <Text color="gray.400" fontSize="sm">
                  クリックして意味を表示
                </Text>
              )}
            </CardBody>
          </Card>

          <HStack justifyContent="center" mt={4}>
            <Button
              leftIcon={<RefreshCw size={18} />}
              onClick={handleNextWord}
              colorScheme="blue"
            >
              次の単語
            </Button>
          </HStack>
        </VStack>
      ) : (
        <Box textAlign="center" py={8}>
          {error ? (
            <>
              <Text mb={4} color="red.500">
                {error}
              </Text>
              <Text color="#000">
                「単語を追加」タブから単語を登録してください。
              </Text>
              <Box mt={4} p={2} bg="gray.100" borderRadius="md">
                <Code fontSize="sm">
                  デバッグ情報: Wordbook ID: {wordbook.id}
                </Code>
              </Box>
            </>
          ) : (
            <>
              <Text mb={4}>この単語帳にはまだ単語がありません。</Text>
              <Text color="#000">
                「単語を追加」から単語を登録してください。
              </Text>
            </>
          )}
          <Button mt={4} onClick={fetchRandomWord} colorScheme="blue" size="sm">
            再試行
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FlashCard;
