// app/page.tsx
"use client";

import { useState } from "react";
import { Heading, Grid, GridItem, Container } from "@chakra-ui/react";
import WordbookList from "@/components/WordbookList";
import AddWordbook from "@/components/AddWordbook";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  // 単語帳が追加されたときにリストを更新する
  const handleWordbookAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Container maxW="container.xl" px={4} py={8}>
      <Heading as="h1" size="xl" mb={6}>
        単語帳アプリ
      </Heading>

      <Grid templateColumns={{ md: "repeat(2, 1fr)" }} gap={8}>
        <GridItem>
          <WordbookList key={refreshKey} />
        </GridItem>
        <GridItem>
          <AddWordbook onWordbookAdded={handleWordbookAdded} />
        </GridItem>
      </Grid>
    </Container>
  );
}
