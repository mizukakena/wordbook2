"use client";

import React, { useState } from "react";

interface AddWordbookProps {
  onWordbookAdded?: () => void; // 単語帳追加後に親コンポーネントに通知するためのコールバック
}

const AddWordbook: React.FC<AddWordbookProps> = ({ onWordbookAdded }) => {
  const [wordbookName, setWordbookName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:8080/save-wordbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wordbook_name: wordbookName }),
      });

      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success response:", data);
      setSuccess(`単語帳「${data.wordbook_name}」が正常に追加されました`);

      // 親コンポーネントに通知
      if (onWordbookAdded) {
        onWordbookAdded();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">新しい単語帳を追加</h2>
      {error && (
        <div className="p-2 mb-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="p-2 mb-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="wordbook-name" className="block mb-1 font-medium">
            単語帳名:
          </label>
          <input
            id="wordbook-name"
            type="text"
            value={wordbookName}
            onChange={(e) => setWordbookName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "追加中..." : "追加"}
        </button>
      </form>
    </div>
  );
};

export default AddWordbook;
