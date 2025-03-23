"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";

export default function AddWordbook() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/wordbooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("単語帳の作成に失敗しました");
      }

      toast({
        title: "単語帳を作成しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // フォームをリセット
      setTitle("");
      setDescription("");
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "不明なエラー",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" mb={6}>
        新しい単語帳を作成
      </Heading>

      <Box as="form" onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>タイトル</FormLabel>
            <Input
              color="#000"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="単語帳のタイトル"
            />
          </FormControl>

          <FormControl>
            <FormLabel>説明</FormLabel>
            <Input
              color="#000"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="単語帳の説明（任意）"
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" isLoading={isLoading} mt={4}>
            単語帳を作成
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
