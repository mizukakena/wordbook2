// src/app/layout.tsx
"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource-variable/oswald";

const theme = extendTheme({
  fonts: {
    heading: "'Oswald Variable', sans-serif",
    body: "'Oswald Variable', sans-serif",
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChakraProvider theme={theme}>
      <html lang="ja">
        <body style={{ backgroundColor: "#0D243D", color: "#fff" }}>
          {children}
        </body>
      </html>
    </ChakraProvider>
  );
}
