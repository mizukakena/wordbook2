// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchWordbooks() {
  const res = await fetch(`${API_URL}/api/wordbooks`);
  if (!res.ok) {
    throw new Error("Failed to fetch wordbooks");
  }
  return res.json();
}

export async function createWordbook(name: string) {
  const res = await fetch(`${API_URL}/save-wordbook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    throw new Error("Failed to create wordbook");
  }

  return res.json();
}
