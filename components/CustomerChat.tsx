"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  sendVisitorMessage,
  subscribeToPublicChatMessages
} from "@/lib/chat";
import { isFirebaseConfigured } from "@/lib/firebase";
import { siteContent } from "@/data/site";

const profileStorageKey = "teekay-chat-profile";

export function CustomerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorContact, setVisitorContact] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "error">("idle");
  const [hasStarted, setHasStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem(profileStorageKey);
    if (!savedProfile) return;

    try {
      const profile = JSON.parse(savedProfile) as { name?: string; contact?: string };
      setVisitorName(profile.name ?? "");
      setVisitorContact(profile.contact ?? "");
      setHasStarted(Boolean(profile.name && profile.contact));
    } catch {
      window.localStorage.removeItem(profileStorageKey);
    }
  }, []);

  useEffect(() => {
    const openChat = () => setIsOpen(true);
    window.addEventListener("teekay:open-chat", openChat);
    return () => window.removeEventListener("teekay:open-chat", openChat);
  }, []);

  useEffect(() => {
    if (!isOpen || !hasStarted || !isFirebaseConfigured) return undefined;

    let unsubscribe: (() => void) | undefined;
    let isActive = true;
    void subscribeToPublicChatMessages(
      (nextMessages) => {
        if (isActive) setMessages(nextMessages);
      },
      () => setSendState("error")
    ).then((nextUnsubscribe) => {
      if (isActive) unsubscribe = nextUnsubscribe;
      else nextUnsubscribe();
    });

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, [hasStarted, isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim() || !visitorName.trim() || !visitorContact.trim()) return;

    setSendState("sending");
    try {
      await sendVisitorMessage({ visitorName, visitorContact, text: message });
      window.localStorage.setItem(
        profileStorageKey,
        JSON.stringify({ name: visitorName.trim(), contact: visitorContact.trim() })
      );
      setHasStarted(true);
      setMessage("");
      setSendState("idle");
    } catch {
      setSendState("error");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <section
          className="mb-3 flex h-[min(560px,calc(100vh-7rem))] w-[min(370px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
          aria-label="Customer service chat"
        >
          <header className="flex items-center justify-between bg-navy-950 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-black">{siteContent.chat.title}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-white/65">Usually replies as soon as possible</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg font-black hover:bg-white/20"
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-[#f8fbff] p-3">
            {!isFirebaseConfigured ? (
              <p className="rounded-lg bg-ember-500/10 p-3 text-sm font-bold leading-6 text-ember-600">
                Online chat is being configured. Please try again shortly.
              </p>
            ) : null}

            <div className="mb-3 max-w-[86%] rounded-lg rounded-tl-sm bg-white p-3 text-sm font-semibold leading-5 text-navy-950 shadow-sm">
              Hi! Tell us what you need sourced, your shipping question, or your tracking concern.
            </div>

            {messages.map((item) => (
              <div
                key={item.id}
                className={`mb-2 max-w-[86%] rounded-lg p-3 text-sm font-semibold leading-5 ${
                  item.sender === "visitor"
                    ? "ml-auto rounded-tr-sm bg-teal-600 text-white"
                    : "rounded-tl-sm bg-white text-navy-950 shadow-sm"
                }`}
              >
                {item.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form className="grid gap-2 border-t border-slate-200 bg-white p-3" onSubmit={submitMessage}>
            {!hasStarted ? (
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={visitorName}
                  onChange={(event) => setVisitorName(event.target.value)}
                  required
                  maxLength={80}
                  placeholder="Your name"
                  className="min-h-10 min-w-0 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-teal-500"
                />
                <input
                  value={visitorContact}
                  onChange={(event) => setVisitorContact(event.target.value)}
                  required
                  maxLength={120}
                  placeholder="Phone or email"
                  className="min-h-10 min-w-0 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-teal-500"
                />
              </div>
            ) : null}
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                maxLength={1000}
                rows={2}
                placeholder="Type your message..."
                className="min-h-12 flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={sendState === "sending" || !isFirebaseConfigured}
                className="inline-flex w-14 items-center justify-center rounded-lg bg-ember-500 text-sm font-black text-white transition hover:bg-navy-950 disabled:opacity-50"
              >
                Send
              </button>
            </div>
            {sendState === "error" ? (
              <p className="text-xs font-bold text-ember-600">Message not sent. Please try again.</p>
            ) : null}
            <p className="text-[10px] font-semibold text-slate-400">
              Your conversation stays on this website. Teekay receives a WhatsApp alert for new messages.
            </p>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="ml-auto inline-flex min-h-12 items-center gap-2 rounded-full bg-navy-950 px-5 text-sm font-black text-white shadow-2xl transition hover:bg-teal-600"
        aria-expanded={isOpen}
      >
        <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-400 before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-teal-400/60" />
        {siteContent.chat.openLabel}
      </button>
    </div>
  );
}
