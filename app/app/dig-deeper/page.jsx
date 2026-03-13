"use client";
import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";

const QUADRANT_META = {
  authLeft:  { label: "Progressive Governance",         color: "#7965B2" },
  authRight: { label: "Conservative Governance",        color: "#C47B3C" },
  libLeft:   { label: "Egalitarian Anti-Establishment", color: "#4A82B0" },
  libRight:  { label: "Free-Market Libertarian",        color: "#4E8E80" },
};

const HISTORY_TTL = 24 * 60 * 60 * 1000;
const INIT_TEXT = "Give me a brief analyst's take on this story — what's the most important context a reader should know, what's genuinely contested vs what all sides agree on, and what to watch for next.";

function getHistoryKey(id) {
  return `dig-deeper-history-${id}`;
}

function loadHistory(id) {
  try {
    const raw = localStorage.getItem(getHistoryKey(id));
    if (!raw) return [];
    const { messages, savedAt } = JSON.parse(raw);
    if (Date.now() - savedAt > HISTORY_TTL) {
      localStorage.removeItem(getHistoryKey(id));
      return [];
    }
    return messages;
  } catch {
    return [];
  }
}

function saveHistory(id, messages) {
  try {
    localStorage.setItem(getHistoryKey(id), JSON.stringify({ messages, savedAt: Date.now() }));
  } catch {}
}

function ChatUI({ story, initialMessages }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const initiated = useRef(false);

  const { messages, sendMessage, status, setMessages } = useChat({
    api: "/api/chat",
    body: { story },
    initialMessages,
    onFinish: () => {
      saveHistory(story.id, messages);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Trigger initial analysis if no history
  useEffect(() => {
    if (!initiated.current && messages.length === 0) {
      initiated.current = true;
      sendMessage({ text: INIT_TEXT });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Persist after messages change
  useEffect(() => {
    if (messages.length > 0) saveHistory(story.id, messages);
  }, [messages, story.id]);

  function submit(e) {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  function clearHistory() {
    localStorage.removeItem(getHistoryKey(story.id));
    setMessages([]);
    initiated.current = false;
    setTimeout(() => {
      initiated.current = true;
      sendMessage({ text: INIT_TEXT });
    }, 0);
  }

  // Hide the auto-sent initial prompt from the visible chat
  const visibleMessages = messages.filter(
    (m) => !(m.role === "user" && m.parts?.some?.(p => p.type === "text" && p.text === INIT_TEXT))
         && !(m.role === "user" && m.content === INIT_TEXT)
  );

  return (
    <>
      {/* Messages */}
      <div style={{ flex: 1, maxWidth: 720, margin: "0 auto", width: "100%", padding: "20px 24px 0", overflowY: "auto" }}>
        {visibleMessages.length === 0 && isLoading && (
          <div style={{ textAlign: "center", padding: "40px 0", fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#b0aba5" }}>
            Generating analysis…
          </div>
        )}

        {visibleMessages.map((m) => {
          const text = m.content ?? m.parts?.filter(p => p.type === "text").map(p => p.text).join("") ?? "";
          return (
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
                {text}
              </div>
            </div>
          );
        })}

        {isLoading && visibleMessages.length > 0 && (
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ background: "#fff", border: "1px solid #EDEAE4", borderRadius: "4px 16px 16px 16px", padding: "14px 18px" }}>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#b0aba5" }}>Thinking…</span>
            </div>
          </div>
        )}

        {visibleMessages.length > 1 && !isLoading && (
          <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
            <button
              onClick={clearHistory}
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
        <form onSubmit={submit} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
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
    </>
  );
}

export default function DigDeeperPage() {
  const [story, setStory] = useState(null);
  const [initialMessages, setInitialMessages] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dig-deeper-story");
      if (raw) {
        const s = JSON.parse(raw);
        setStory(s);
        setInitialMessages(loadHistory(s.id));
      } else {
        setInitialMessages([]);
      }
    } catch {
      setInitialMessages([]);
    }
  }, []);

  if (initialMessages === null) return null;

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

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", color: "#1a1916", display: "flex", flexDirection: "column" }}>
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

      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", padding: "16px 24px 0" }}>
        <button onClick={() => window.history.back()} style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#9a9590", background: "none", border: "none", cursor: "pointer", padding: 0 }}>← Back</button>
      </div>

      <ChatUI story={story} initialMessages={initialMessages} />
    </div>
  );
}
