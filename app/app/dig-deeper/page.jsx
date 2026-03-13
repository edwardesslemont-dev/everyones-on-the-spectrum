"use client";
import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";

const QUADRANT_META = {
  authLeft:  { label: "Progressive Governance",         color: "#7965B2" },
  authRight: { label: "Conservative Governance",        color: "#C47B3C" },
  libLeft:   { label: "Egalitarian Anti-Establishment", color: "#4A82B0" },
  libRight:  { label: "Free-Market Libertarian",        color: "#4E8E80" },
};

const HISTORY_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getHistoryKey(storyId) {
  return `dig-deeper-history-${storyId}`;
}

function loadHistory(storyId) {
  try {
    const raw = localStorage.getItem(getHistoryKey(storyId));
    if (!raw) return [];
    const { messages, savedAt } = JSON.parse(raw);
    if (Date.now() - savedAt > HISTORY_TTL) {
      localStorage.removeItem(getHistoryKey(storyId));
      return [];
    }
    return messages;
  } catch {
    return [];
  }
}

function saveHistory(storyId, messages) {
  try {
    localStorage.setItem(
      getHistoryKey(storyId),
      JSON.stringify({ messages, savedAt: Date.now() })
    );
  } catch {}
}

export default function DigDeeperPage() {
  const [story, setStory] = useState(null);
  const [ready, setReady] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load story from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dig-deeper-story");
      if (raw) setStory(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const savedMessages = story ? loadHistory(story.id) : [];

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: { story },
    initialMessages: savedMessages,
    onFinish: () => {
      if (story) saveHistory(story.id, messages);
    },
  });

  // Persist after each message change
  useEffect(() => {
    if (story && messages.length > 0) saveHistory(story.id, messages);
  }, [messages, story]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Send initial analysis if no history
  useEffect(() => {
    if (story && ready && messages.length === 0) {
      const syntheticSubmit = new Event("submit");
      // Trigger initial analysis via the chat API
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story,
          messages: [
            {
              role: "user",
              content: `Give me a brief analyst's take on this story — what's the most important context a reader should know, what's genuinely contested vs what all sides agree on, and what to watch for next.`,
            },
          ],
        }),
      }).then(async (res) => {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        const assistantId = `init-${Date.now()}`;
        setMessages([
          { id: "init-user", role: "user", content: "Give me a brief analyst's take on this story — what's the most important context a reader should know, what's genuinely contested vs what all sides agree on, and what to watch for next." },
          { id: assistantId, role: "assistant", content: "" },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Parse AI SDK data stream format (lines like: 0:"text chunk")
          chunk.split("\n").forEach((line) => {
            const match = line.match(/^0:"(.*)"$/);
            if (match) {
              try {
                fullText += JSON.parse(`"${match[1]}"`);
              } catch {}
            }
          });
          setMessages([
            { id: "init-user", role: "user", content: "Give me a brief analyst's take on this story — what's the most important context a reader should know, what's genuinely contested vs what all sides agree on, and what to watch for next." },
            { id: assistantId, role: "assistant", content: fullText },
          ]);
        }
      }).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story, ready]);

  if (!ready) return null;

  if (!story) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAF7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 14, color: "#9a9590", marginBottom: 16 }}>No story selected.</p>
          <a href="/" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#7965B2", textDecoration: "none" }}>← Back to stories</a>
        </div>
      </div>
    );
  }

  const visibleMessages = messages.filter((m) => m.role !== "user" || m.id !== "init-user");

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", color: "#1a1916", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #EDEAE4", textAlign: "center", padding: "28px 24px 20px", background: "#fff", flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", color: "#a09b95", textTransform: "uppercase", marginBottom: 10 }}>Dig Deeper</div>
        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, lineHeight: 1.25, color: "#1a1916", maxWidth: 680, margin: "0 auto" }}>{story.headline}</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {Object.entries(story.quadrants).map(([key, q]) => (
            <span key={key} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-inter), sans-serif", fontSize: 10, color: QUADRANT_META[key]?.color || q.color, fontWeight: 600, letterSpacing: "0.06em" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: QUADRANT_META[key]?.color || q.color, display: "inline-block" }} />
              {q.label}
            </span>
          ))}
        </div>
      </header>

      {/* Back link */}
      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", padding: "16px 24px 0" }}>
        <button onClick={() => window.history.back()} style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#9a9590", background: "none", border: "none", cursor: "pointer", padding: 0 }}>← Back</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, maxWidth: 720, margin: "0 auto", width: "100%", padding: "20px 24px 0", overflowY: "auto" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#b0aba5" }}>
            Generating analysis…
          </div>
        )}

        {visibleMessages.map((m) => (
          <div key={m.id} style={{ marginBottom: 20, display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0aba5", marginBottom: 6 }}>Analyst</span>
            )}
            <div style={{
              maxWidth: "85%",
              padding: m.role === "user" ? "10px 16px" : "16px 20px",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
              background: m.role === "user" ? "#7965B2" : "#fff",
              border: m.role === "user" ? "none" : "1px solid #EDEAE4",
              color: m.role === "user" ? "#fff" : "#2a2724",
              fontFamily: "var(--font-source-serif), Georgia, serif",
              fontSize: 14,
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ background: "#fff", border: "1px solid #EDEAE4", borderRadius: "4px 16px 16px 16px", padding: "14px 18px" }}>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#b0aba5" }}>Thinking…</span>
            </div>
          </div>
        )}

        {messages.length > 2 && (
          <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
            <button
              onClick={() => { setMessages([]); if (story) localStorage.removeItem(getHistoryKey(story.id)); }}
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 11, color: "#c8c4be", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, padding: 0 }}
            >
              Clear conversation
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", padding: "16px 24px 32px", flexShrink: 0 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
            placeholder="Ask a follow-up question…"
            rows={1}
            style={{
              flex: 1,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #EDEAE4",
              background: "#fff",
              color: "#1a1916",
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
              overflowY: "hidden",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              background: input.trim() && !isLoading ? "#7965B2" : "#d0cbc5",
              border: "none",
              borderRadius: 12,
              padding: "12px 20px",
              cursor: input.trim() && !isLoading ? "pointer" : "default",
              transition: "background 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            Send
          </button>
        </form>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, color: "#c8c4be", marginTop: 8, textAlign: "center" }}>
          Conversation history saved for 24 hours · Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
