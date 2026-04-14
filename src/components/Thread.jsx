import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Edit2, Trash2, X, Check } from "lucide-react";
import { Leaf } from "./Leaf";
import { MoodBadge } from "./MoodBadge";
import { MoodPicker } from "./MoodPicker";
import { validateThreadText } from "../utils/validators";
import { MAX_DEPTH } from "../utils/constants";

export function Thread({ data, onReply, onEdit, onDelete, compact = false, depth = 0 }) {
  // Recursive thread component with edit, delete, and reply functionality
  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [selectedMood, setSelectedMood] = useState("thoughtful");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.text);
  const hasReplies = data.replies && data.replies.length > 0;
  const canAddReply = depth < MAX_DEPTH;

  useEffect(() => {
    if (hasReplies) {
      // subtle animation trigger for new replies
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.replies?.length]);

  const handleAddReply = () => {
    if (!replyText.trim()) return;

    const result = onReply(data.id, replyText, selectedMood);
    if (result?.success) {
      setReplyText("");
      setSelectedMood("thoughtful");
    }
  };

  const handleEdit = () => {
    const validation = validateThreadText(editText);
    if (!validation.valid) {
      return;
    }
    onEdit(data.id, editText);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this thread and all its replies?")) {
      onDelete(data.id);
    }
  };

  return (
    <motion.div
      layout
      className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border-2 border-emerald-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-3">
        <Leaf mood={data.mood} size={22} grown={hasReplies} />
        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2">
              <textarea
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="text-green-600 dark:text-green-400 p-2 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-110 active:scale-95"
                  title="Save"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(data.text);
                  }}
                  className="text-red-600 dark:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-110 active:scale-95"
                  title="Cancel"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="text-gray-800 dark:text-gray-200">{data.text}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 p-1 transition-all hover:scale-110 active:scale-95"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1 transition-all hover:scale-110 active:scale-95"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => setOpen((s) => !s)}
                  className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/40 hover:to-blue-500/40 text-emerald-700 dark:text-emerald-400 text-sm font-bold px-3 py-1 rounded-full transition-all hover:scale-105 active:scale-95"
                >
                  {open ? "🌳 Hide Branches" : `🌱 Grow Thread (${data.replies?.length || 0})`}
                </button>

                <MoodBadge mood={data.mood} />
              </div>
            </>
          )}
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
            className="mt-3 pl-10 border-l-2 border-emerald-100 dark:border-gray-700 space-y-3"
          >
            {/* children threads */}
            {hasReplies ? (
              data.replies.map((r) => (
                <Thread
                  key={r.id}
                  data={r}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  compact
                  depth={depth + 1}
                />
              ))
            ) : (
              <div className="text-sm text-gray-400 dark:text-gray-500">
                No branches yet — start one.
              </div>
            )}

            {/* reply input for THIS node */}
            {canAddReply ? (
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 text-sm p-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none dark:focus:ring-emerald-500"
                  placeholder="Add a branch..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddReply();
                    }
                  }}
                />

                <MoodPicker value={selectedMood} onChange={setSelectedMood} />

                <button
                  onClick={handleAddReply}
                  className="text-emerald-600 dark:text-emerald-400 p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all hover:scale-110 active:scale-95 hover:shadow-lg"
                  aria-label="Add branch"
                >
                  <PlusCircle size={18} />
                </button>
              </div>
            ) : (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Maximum nesting depth reached
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* subtle connector glow when node has replies */}
      <div
        aria-hidden
        className={`absolute -left-1 top-6 h-6 w-1 rounded-r-full transition-all ${
          data.replies?.length ? "bg-emerald-200 dark:bg-emerald-800" : "bg-transparent"
        }`}
      />
    </motion.div>
  );
}
