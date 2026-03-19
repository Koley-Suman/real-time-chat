"use client";
import { useEffect, useRef, useState } from "react";

export default function ChatDemo() {
  const [messages, setMessages] = useState<string[]>([
    "Hello 👋",
    "How are you?",
    "This is a test message",
  ]);

  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ✅ FIX 1: dynamic viewport height (KEY FIX)
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.visualViewport?.height;
      if (vh) {
        document.documentElement.style.setProperty(
          "--app-height",
          `${vh}px`
        );
      }
    };

    updateHeight();

    window.visualViewport?.addEventListener("resize", updateHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateHeight);
    };
  }, []);

  // ✅ FIX 2: scroll only inside message container
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div
      className="fixed top-0 left-0 w-full flex flex-col bg-black text-white"
      style={{ height: "var(--app-height)" }} // ✅ KEY LINE
    >

      {/* HEADER */}
      <div className="h-16 shrink-0 bg-gray-900 flex items-center px-4 border-b border-gray-700">
        <h1 className="font-semibold">Chat Header</h1>
      </div>

      {/* MESSAGES */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className="bg-gray-700 px-3 py-2 rounded-lg w-fit max-w-[70%]"
          >
            {msg}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="shrink-0 bg-gray-900 p-2 border-t border-gray-700 pb-[env(safe-area-inset-bottom)]">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-800 outline-none"
            placeholder="Type message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}