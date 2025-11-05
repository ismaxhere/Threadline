import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, PlusCircle, Sparkle } from "lucide-react";

/* Threadline - visually alive prototype
   - recursive addReply (works at any depth)
   - leaf + branch animations
   - mood tags
   - micro-toast feedback
*/

export default function App() {
  const [threads, setThreads] = useState([
    { id: makeId(), text: "Welcome to Threadline 🌿", mood: "calm", replies: [] },
  ]);
  const [input, setInput] = useState("");
  const [toast, setToast] = useState(null);

  const addThread = () => {
    if (!input.trim()) return;
    setThreads((prev) => [
      ...prev,
      { id: makeId(), text: input.trim(), mood: "thoughtful", replies: [] },
    ]);
    setInput("");
    flashToast("Your tree grew +1 branch");
  };

  // recursive addReply - inserts reply anywhere in the tree
  const addReply = (targetId, replyText, mood = "thoughtful") => {
    if (!replyText || !replyText.trim()) return;

    const nodeToAdd = { id: makeId(), text: replyText.trim(), mood, replies: [] };

    const addToTree = (node) => {
      if (node.id === targetId) {
        return {
          ...node,
          replies: [...(node.replies || []), nodeToAdd],
        };
      }
      if (node.replies && node.replies.length) {
        return {
          ...node,
          replies: node.replies.map(addToTree),
        };
      }
      return node;
    };

    setThreads((prev) => prev.map(addToTree));
    flashToast("Your tree grew +1 branch");
  };

  const flashToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 1600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center py-10 px-4">
      <header className="w-full max-w-2xl flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-800 tracking-tight flex items-center gap-3">
            <span className="rounded-full bg-emerald-700/10 p-2">
              <Sparkle size={18} />
            </span>
            Threadline
          </h1>
          <p className="text-sm text-gray-500 mt-1">Conversations that grow with you.</p>
        </div>
        <div className="text-sm text-gray-500">Prototype</div>
      </header>

      <main className="w-full max-w-2xl space-y-4">
        {threads.map((t) => (
          <Thread key={t.id} data={t} onReply={addReply} compact={false} />
        ))}
      </main>

      <div className="fixed bottom-6 w-full max-w-2xl flex items-center gap-3 bg-white rounded-2xl p-3 shadow-xl border border-gray-100">
        <input
          className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Start a new thought..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addThread()}
        />
        <button
          onClick={addThread}
          className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 flex items-center gap-2"
          aria-label="Send"
        >
          <Send size={16} />
          <span className="text-sm font-medium">Post</span>
        </button>
      </div>

      <AnimatePresence>{toast && <Toast text={toast} />}</AnimatePresence>
    </div>
  );
}

/* Thread component - recursive */
function Thread({ data, onReply, compact = false }) {
  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedMood, setSelectedMood] = useState("thoughtful");
  const hasReplies = data.replies && data.replies.length > 0;

  // subtle highlight when replies change (pulse)
  useEffect(() => {
    if (hasReplies) {
      // briefly open a tiny animation by toggling open
      // (no forced UI change; just a trigger for leaf growth)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.replies?.length]);

  return (
    <motion.div
      layout
      className="relative bg-white rounded-2xl p-4 shadow-md border border-emerald-50"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        <Leaf mood={data.mood} size={22} grown={hasReplies} />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-gray-800">{data.text}</p>
            <div className="text-xs text-gray-400">{/* timestamp if needed */}</div>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => setOpen((s) => !s)}
              className="text-emerald-600 text-sm font-medium"
            >
              {open ? "Hide Branches" : `Grow Thread (${data.replies?.length || 0})`}
            </button>

            <MoodBadge mood={data.mood} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="branches"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.22 }}
            className="mt-3 pl-10 border-l-2 border-emerald-100 space-y-3"
          >
            {/* children threads */}
            {hasReplies ? (
              data.replies.map((r) => <Thread key={r.id} data={r} onReply={onReply} compact />)
            ) : (
              <div className="text-sm text-gray-400">No branches yet — start one.</div>
            )}

            {/* reply input for THIS node */}
            <div className="flex items-center gap-2">
              <input
                className="flex-1 text-sm p-2 border border-gray-200 rounded-xl focus:outline-none"
                placeholder="Add a branch..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onReply(data.id, replyText, selectedMood);
                    setReplyText("");
                  }
                }}
              />

              <MoodPicker value={selectedMood} onChange={setSelectedMood} />

              <button
                onClick={() => {
                  onReply(data.id, replyText, selectedMood);
                  setReplyText("");
                }}
                className="text-emerald-600 p-2 rounded-md hover:bg-emerald-50"
                aria-label="Add branch"
              >
                <PlusCircle size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* subtle connector glow when node has replies */}
      <div
        aria-hidden
        className={`absolute -left-1 top-6 h-6 w-1 rounded-r-full transition-all ${
          data.replies?.length ? "bg-emerald-200" : "bg-transparent"
        }`}
      />
    </motion.div>
  );
}

/* Small animated leaf representing the node; 'grown' toggles leaf scale/color */
function Leaf({ mood = "thoughtful", size = 18, grown = false }) {
  const color = moodColor(mood);
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0.9 }}
      animate={{ scale: grown ? 1.15 : 1, rotate: grown ? 6 : 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="flex-shrink-0"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <path
          d="M3 12c4-6 10-7 14-7-1 6-4 10-8 12C7 18 4 14 3 12z"
          fill={color}
          fillOpacity="0.14"
        />
        <path
          d="M6 9.5c2-1 4.5-1.2 7-0.5"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
    </motion.div>
  );
}

/* Mood badge for read-only display */
function MoodBadge({ mood }) {
  const map = {
    calm: ["Calm", "text-emerald-600/90", "bg-emerald-50"],
    happy: ["Happy", "text-amber-600/90", "bg-amber-50"],
    thoughtful: ["Thoughtful", "text-sky-600/90", "bg-sky-50"],
  };
  const [label, txt, bg] = map[mood] || map.thoughtful;
  return <div className={`text-xs font-medium px-2 py-1 rounded-full ${txt} ${bg}`}>{label}</div>;
}

/* Mood picker used in reply input */
function MoodPicker({ value, onChange }) {
  const options = [
    { key: "calm", emoji: "🌿" },
    { key: "happy", emoji: "☀️" },
    { key: "thoughtful", emoji: "💭" },
  ];
  return (
    <div className="flex items-center gap-1">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`p-1 rounded-md text-sm ${value === o.key ? "ring-2 ring-emerald-200" : ""}`}
          title={o.key}
        >
          <span aria-hidden role="img">
            {o.emoji}
          </span>
        </button>
      ))}
    </div>
  );
}

/* tiny toast */
function Toast({ text }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-emerald-800 text-white px-4 py-2 rounded-full text-sm shadow-lg"
    >
      {text}
    </motion.div>
  );
}

/* util */
function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function moodColor(mood) {
  switch (mood) {
    case "calm":
      return "#0f766e"; // teal
    case "happy":
      return "#b45309"; // amber
    case "thoughtful":
    default:
      return "#0369a1"; // sky
  }
}
