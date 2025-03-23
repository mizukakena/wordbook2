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
  useToast,
  VStack,
} from "@chakra-ui/react";

interface AddWordbookProps {
  onWordbookAdded?: () => void;
}

const AddWordbook: React.FC<AddWordbookProps> = ({ onWordbookAdded }) => {
  const [wordbookName, setWordbookName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/add-wordbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wordbook_name: wordbookName }),
      });

      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success response:", data);

      toast({
        title: "単語帳を追加しました",
        description: `「${wordbookName}」を追加しました`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setWordbookName("");

      if (onWordbookAdded) {
        onWordbookAdded();
      }
    } catch (error) {
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
    <Box
      p={4}
      borderWidth={1}
      borderRadius="lg"
      backgroundColor="#fff"
      width="80%"
      justifySelf="center"
    >
      <Heading as="h2" size="md" mb={4} color="#000">
        新しい単語帳を追加
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel htmlFor="wordbookName" color="#000">
              単語帳名:
            </FormLabel>
            <Input
              color="#000"
              id="wordbookName"
              value={wordbookName}
              onChange={(e) => setWordbookName(e.target.value)}
              placeholder="例: 英検準1級"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="追加中..."
            isDisabled={loading || !wordbookName}
          >
            単語帳を追加
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddWordbook;
