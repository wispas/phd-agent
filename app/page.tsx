"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("");

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    setAnswer("");
    setMode("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      setMode(data.action);

      if (data.action === "search") {
        setResults(data.results || []);
      }

      if (data.action === "write") {
        setAnswer(data.answer || "");
      }

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", fontFamily: "sans-serif" }}>
      
      <h1>🧠 PhD Research Assistant</h1>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          style={{ flex: 1, padding: 10 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about Aristotle..."
          onKeyDown={(e) => e.key === "Enter" && search()}
        />

        <button onClick={search} style={{ padding: "10px 20px" }}>
          Search
        </button>
      </div>

      {/* STATUS */}
      {loading && <p>🤖 Thinking...</p>}
      {mode && !loading && <p>Mode: <b>{mode}</b></p>}

      {/* ANSWER */}
      {answer && (
        <div style={{ marginTop: 20, padding: 15, background: "#f5f5f5" }}>
          <h3>📖 Answer</h3>
          <p style={{ color: "black" }}>{answer}</p>
        </div>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>🔍 Sources</h3>
          <ul>
            {results.map((r, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <p>{r.text}</p>
                <small>Score: {r.score}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}