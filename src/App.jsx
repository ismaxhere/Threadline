import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Send, Moon, Sun, Download } from "lucide-react";
import { Thread } from "./components/Thread";
import { Toast } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useThreads } from "./hooks/useThreads";
import { useToast } from "./hooks/useToast";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { exportThreadsAsJSON, countThreads } from "./utils/helpers";
import { THEMES, STORAGE_KEYS } from "./utils/constants";

export default function App() {
  const { threads, addThread, addReply, editThread, deleteThread } = useThreads();
  const { toast, flashToast } = useToast();
  const [input, setInput] = useState("");
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.THEME, THEMES.LIGHT);

  // Apply theme to document
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === THEMES.DARK) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [theme]);

  const handleAddThread = () => {
    if (!input.trim()) {
      flashToast("Thread cannot be empty");
      return;
    }

    const result = addThread(input.trim(), "thoughtful");
    if (result.success) {
      setInput("");
      flashToast("Your tree grew +1 branch");
    } else {
      flashToast(result.error);
    }
  };

  const handleAddReply = (targetId, replyText, mood) => {
    const result = addReply(targetId, replyText, mood);
    if (result.success) {
      flashToast("Your tree grew +1 branch");
    } else {
      flashToast(result.error);
    }
    return result;
  };

  const handleEditThread = (threadId, newText) => {
    const result = editThread(threadId, newText);
    if (result.success) {
      flashToast("Thread updated");
    } else {
      flashToast(result.error);
    }
  };

  const handleDeleteThread = (threadId) => {
    deleteThread(threadId);
    flashToast("Thread deleted");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT));
  };

  const handleExport = () => {
    exportThreadsAsJSON(threads);
    flashToast("Threads exported");
  };

  const threadCount = countThreads(threads);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex flex-col items-center py-10 px-4 transition-colors duration-300 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 dark:bg-emerald-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <header className="w-full max-w-2xl flex items-center justify-between mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent tracking-tighter">
                Threadline
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg animate-bounce" style={{animationDuration: '3s'}}>
                Prototype ✨
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">
              ✧ Conversations that grow with you ✧
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-yellow-400 hover:shadow-lg dark:hover:shadow-yellow-900/50 transition-all transform hover:scale-110 active:scale-95"
                aria-label="Toggle theme"
              >
                {theme === THEMES.LIGHT ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button
                onClick={handleExport}
                className="p-2 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 dark:from-gray-700 dark:to-gray-800 text-white dark:text-blue-400 hover:shadow-lg dark:hover:shadow-blue-900/50 transition-all transform hover:scale-110 active:scale-95"
                aria-label="Export threads"
              >
                <Download size={18} />
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {threadCount} total threads
            </div>
          </div>
        </header>

        <main className="w-full max-w-2xl space-y-4 mb-20 relative z-10">
          {threads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 dark:text-gray-500">No threads yet. Start creating!</p>
            </div>
          ) : (
            threads.map((t) => (
              <Thread
                key={t.id}
                data={t}
                onReply={handleAddReply}
                onEdit={handleEditThread}
                onDelete={handleDeleteThread}
                compact={false}
                depth={0}
              />
            ))
          )}
        </main>

        <div className="fixed bottom-6 w-full max-w-2xl flex items-center gap-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border border-gray-100/50 dark:border-gray-700/50 relative z-20">
          <input
            className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            placeholder="Start a new thought..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddThread()}
          />
          <button
            onClick={handleAddThread}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white p-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 dark:hover:from-emerald-500 dark:hover:to-emerald-600 flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/50 active:scale-95 font-bold"
            aria-label="Send"
          >
            <Send size={16} />
            <span className="text-sm font-bold">Post</span>
          </button>
        </div>

        <AnimatePresence>{toast && <Toast text={toast} />}</AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}