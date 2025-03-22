// src/app/add-wordbook/page.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Field,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createWordbook } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddWordbook() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createWordbook(name);
      router.push("/");
    } catch (error) {
      console.error("Error creating wordbook:", error);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        <Heading as="h1" size="xl">
          Add a New Wordbook
        </Heading>
        <Text>This is the page to add a new wordbook.</Text>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Field.Root id="name">
              <Field.Label>Wordbook Name:</Field.Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                borderColor="blue.400"
                _focus={{ borderColor: "blue.400" }}
              />
            </Field.Root>
            <Button type="submit" colorScheme="blue" width="fit-content">
              Create Wordbook
            </Button>
          </VStack>
        </Box>

        <Box mt={4}>
          <Link href="/" passHref>
            <Button as="a" colorScheme="gray" variant="ghost">
              Back to Home
            </Button>
          </Link>
        </Box>
      </VStack>
    </Container>
  );
}
