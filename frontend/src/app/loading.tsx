"use client";

import { useEffect, useState } from "react";
import { Box, Flex, Image, Heading } from "@chakra-ui/react";

export default function Loading() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prev) => (prev === 1 ? 0.7 : 1));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bg="#0a1a2f"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
    >
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        opacity={opacity}
        transition="opacity 700ms ease-in-out"
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          mb={4}
          width="70%"
          height="80%"
        >
          <Image
            src="/images/logo-dark.svg"
            alt="Flashbook"
            maxWidth="100%"
            maxHeight="100%"
            objectFit="contain"
          />
        </Flex>
        <Heading
          color="white"
          fontSize="1.5rem"
          fontWeight="bold"
          letterSpacing="0.05em"
          mt={4}
        >
          Flashbook
        </Heading>
      </Flex>
    </Box>
  );
}
