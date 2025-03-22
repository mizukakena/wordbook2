// src/app/layout.tsx
import { Providers } from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordbook App",
  description: "A wordbook application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
