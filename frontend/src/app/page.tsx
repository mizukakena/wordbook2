// src/app/page.tsx
import {
  Container,
  Heading,
  Text,
  Box,
  Button,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={4} align="stretch">
        <Heading as="h1" size="xl">
          Welcome to My Go Web Application!
        </Heading>
        <Text>This page is rendered using Next.js.</Text>
        <Text>These are the wordbook you have.</Text>

        <Box textAlign="right" mt={4}>
          <Link href="/add-wordbook">
            <Button
              colorScheme="blue"
              size="sm"
              borderRadius="full"
              width="40px"
              height="40px"
            >
              +
            </Button>
          </Link>
        </Box>
      </VStack>
    </Container>
  );
}
