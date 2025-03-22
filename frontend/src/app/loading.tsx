"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prev) => (prev === 1 ? 0.7 : 1));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0a1a2f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: opacity,
          transition: "opacity 700ms ease-in-out",
        }}
      >
        {/* 画像を中央に配置 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "16px",
            width: "70%",
            height: "80%",
          }}
        >
          <img
            src="/images/logo-dark.svg"
            alt="Flashbook"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
        <h1
          style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
            letterSpacing: "0.05em",
            marginTop: "16px",
          }}
        >
          Flashbook
        </h1>
      </div>
    </div>
  );
}
