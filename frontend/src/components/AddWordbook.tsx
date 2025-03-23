"use client";

import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

interface AddWordbookProps {
  onWordbookAdded?: () => void; // 単語帳追加後に親コンポーネントに通知するためのコールバック
}

const AddWordbook: React.FC<AddWordbookProps> = ({ onWordbookAdded }) => {
  const [wordbookName, setWordbookName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:8080/save-wordbook", {
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
      setSuccess(`単語帳「${data.wordbook_name}」が正常に追加されました`);

      // 親コンポーネントに通知
      if (onWordbookAdded) {
        onWordbookAdded();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={6} p={4} borderWidth={1} borderRadius="lg">
      <Heading as="h2" size="md" mb={4}>
        新しい単語帳を追加
      </Heading>

      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {success && (
        <Alert status="success" mb={4} borderRadius="md">
          <AlertIcon />
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel htmlFor="wordbook-name">単語帳名:</FormLabel>
          <Input
            id="wordbook-name"
            type="text"
            value={wordbookName}
            onChange={(e) => setWordbookName(e.target.value)}
            required
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={loading}
          loadingText="追加中..."
          isDisabled={loading}
        >
          追加
        </Button>
      </form>
    </Box>
  );
};

export default AddWordbook;
