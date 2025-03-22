"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Loading from "@/app/loading";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // アプリケーションの初期ロード時にローディング状態を管理
  useEffect(() => {
    // ページが完全に読み込まれたらローディングを非表示にする
    const handleLoad = () => {
      // 少し遅延を入れてローディング画面を表示する時間を確保
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2秒後にローディング画面を非表示
    };

    // ページがすでに読み込まれている場合
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // isLoadingがtrueの間は子コンポーネントを表示しない
  if (isLoading) {
    return <Loading />;
  }

  // isLoadingがfalseになったら子コンポーネントを表示
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
