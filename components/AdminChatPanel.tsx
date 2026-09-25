"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ChatMessage,
  ChatThread,
  markChatRead,
  sendAdminChatMessage,
  subscribeToAdminChatMessages,
  subscribeToAdminChats
} from "@/lib/chat";

export function AdminChatPanel() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeId, setActiveId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "error">("idle");

  useEffect(() => subscribeToAdminChats(setThreads, () => undefined), []);

  useEffect(() => {
    if (!activeId && threads.length) setActiveId(threads[0].id);
  }, [activeId, threads]);

  useEffect(() => {
    if (!activeId) return undefined;
    void markChatRead(activeId).catch(() => undefined);
    return subscribeToAdminChatMessages(activeId, setMessages, () => setMessages([]));
  }, [activeId]);

  const submitReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeId || !reply.trim()) return;
    setSendState("sending");
    try {
      await sendAdminChatMessage(activeId, reply);
      setReply("");
      setSendState("idle");
    } catch {
      setSendState("error");
    }
  };

  const activeThread = threads.find((thread) => thread.id === activeId);

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-teal-600">Website chat</p>
          <h2 className="mt-1 text-2xl font-black text-navy-950">Customer conversations</h2>
        </div>
        <span className="rounded-full bg-ember-500 px-3 py-1 text-xs font-black text-white">
          {threads.reduce((sum, thread) => sum + thread.unreadByAdmin, 0)} unread
        </span>
      </div>

      <div className="grid min-h-[430px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft lg:grid-cols-[280px_1fr]">
        <aside className="max-h-[520px] overflow-y-auto border-b border-slate-200 lg:border-b-0 lg:border-r">
          {!threads.length ? (
            <p className="p-4 text-sm font-bold text-slate-500">No website chats yet.</p>
          ) : null}
          {threads.map((thread) => (
            <button
              type="button"
              key={thread.id}
              onClick={() => setActiveId(thread.id)}
              className={`block w-full border-b border-slate-100 p-4 text-left transition ${
                activeId === thread.id ? "bg-teal-500/10" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-black text-navy-950">{thread.visitorName}</span>
                {thread.unreadByAdmin ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ember-500 px-1 text-[10px] font-black text-white">
                    {thread.unreadByAdmin}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 truncate text-xs font-bold text-slate-500">{thread.lastMessage}</p>
            </button>
          ))}
        </aside>

        <div className="flex min-h-[430px] flex-col">
          {activeThread ? (
            <>
              <header className="border-b border-slate-200 px-4 py-3">
                <p className="font-black text-navy-950">{activeThread.visitorName}</p>
                <p className="mt-0.5 text-xs font-bold text-slate-500">{activeThread.visitorContact}</p>
              </header>
              <div className="flex-1 overflow-y-auto bg-[#f8fbff] p-4">
                {messages.map((message) => (
                  <p
                    key={message.id}
                    className={`mb-2 max-w-[82%] rounded-lg p-3 text-sm font-semibold leading-5 ${
                      message.sender === "admin"
                        ? "ml-auto bg-navy-950 text-white"
                        : "bg-white text-navy-950 shadow-sm"
                    }`}
                  >
                    {message.text}
                  </p>
                ))}
              </div>
              <form className="flex gap-2 border-t border-slate-200 p-3" onSubmit={submitReply}>
                <input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  maxLength={1000}
                  required
                  placeholder="Reply on the website..."
                  className="min-h-11 flex-1 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={sendState === "sending"}
                  className="rounded-lg bg-teal-600 px-5 text-sm font-black text-white hover:bg-navy-950 disabled:opacity-60"
                >
                  Send
                </button>
              </form>
              {sendState === "error" ? (
                <p className="px-4 pb-3 text-xs font-bold text-ember-600">Reply failed. Try again.</p>
              ) : null}
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-6 text-sm font-bold text-slate-500">
              Select a conversation.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
