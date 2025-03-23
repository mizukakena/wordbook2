// src/app/layout.tsx
import { ChakraProvider } from "@chakra-ui/react";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Wordbook App",
//   description: "A wordbook application",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ChakraProvider cssVarsRoot="body">{children}</ChakraProvider>
      </body>
    </html>
  );
}
