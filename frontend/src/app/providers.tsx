"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { LoadingProvider } from "@/components/loading-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <LoadingProvider>{children}</LoadingProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
