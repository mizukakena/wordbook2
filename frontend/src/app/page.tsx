"use client";

import { useState } from "react";
import {
  Heading,
  Grid,
  GridItem,
  Container,
  Box,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import WordbookList, { type Wordbook } from "@/components/WordbookList";
import AddWordbook from "@/components/AddWordbook";
import WordDetail from "@/components/WordDetail";
import FlashCard from "@/components/FlashCard";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedWordbook, setSelectedWordbook] = useState<Wordbook | null>(
    null
  );
  const toast = useToast();

  // 単語帳が追加されたときにリストを更新する
  const handleWordbookAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    // 新しい単語帳が追加されたら選択状態をリセット
    setSelectedWordbook(null);
  };

  // 単語が追加されたときにリストを更新する
  const handleWordAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    // 単語帳の単語数を更新するために再取得する必要がある
    // 実際のAPIから最新の単語帳情報を取得する処理を追加するとよい
  };

  // 単語帳を選択したときの処理
  const handleSelectWordbook = (wordbook: Wordbook) => {
    setSelectedWordbook(wordbook);
    toast({
      title: "単語帳を選択しました",
      description: `「${wordbook.wordbook_name}」を選択しました。`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" px={4} py={8}>
      <Heading as="h1" size="xl" mb={6}>
        単語帳アプリ
      </Heading>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
        <GridItem>
          <Box mb={8}>
            <WordbookList
              key={refreshKey}
              onSelectWordbook={handleSelectWordbook}
            />
          </Box>
          <Box>
            <AddWordbook onWordbookAdded={handleWordbookAdded} />
          </Box>
        </GridItem>
        <GridItem>
          {selectedWordbook && (
            <Tabs colorScheme="blue" variant="enclosed">
              <TabList>
                <Tab>単語を追加</Tab>
                <Tab>フラッシュカード</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0} pt={4}>
                  <WordDetail
                    wordbook={selectedWordbook}
                    onWordAdded={handleWordAdded}
                  />
                </TabPanel>
                <TabPanel p={0} pt={4}>
                  <FlashCard wordbook={selectedWordbook} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}

          {!selectedWordbook && (
            <Box p={4} borderWidth={1} borderRadius="lg">
              <Text>左側の単語帳リストから単語帳を選択してください。</Text>
            </Box>
          )}
        </GridItem>
      </Grid>
    </Container>
  );
}
