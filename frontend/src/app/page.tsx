// app/page.tsx
"use client";

import { useState } from "react";
import WordbookList from "@/components/WordbookList";
import AddWordbook from "@/components/AddWordbook";

"user.client";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  // 単語帳が追加されたときにリストを更新する
  const handleWordbookAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">単語帳アプリ</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <WordbookList key={refreshKey} />
        </div>
        <div>
          <AddWordbook onWordbookAdded={handleWordbookAdded} />
        </div>
      </div>
    </main>
  );
}
