"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { NoteType } from "@/types";
import { noteService } from "@/services/notes";
import AIPanel from "@/components/ai/AIPanel";
import { timeAgo } from "@/utils/format";
import { useDisclosure } from "@/hooks/useDisclosure";
import { ArrowLeft, Pencil, Trash2, Sparkles, X } from "lucide-react";

export default function NoteDetail({ note }: { note: NoteType }) {
  const router = useRouter();
  const deleteModal = useDisclosure();
  const [deleting, setDeleting] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const [aiData, setAiData] = useState({
    aiSummary: note.aiSummary,
    aiKeyPoints: note.aiKeyPoints,
    aiQuestions: note.aiQuestions,
  });

  async function handleDelete() {
    setDeleting(true);
    try {
      await noteService.remove(note._id);
      toast.success("Note deleted");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Failed to delete note");
      setDeleting(false);
      deleteModal.close();
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">

      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={15} />
          Notes
        </Link>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAI((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-95 ${
              showAI
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {showAI ? <X size={12} /> : <Sparkles size={12} />}
            {showAI ? "Close AI" : "AI"}
          </button>

          <Link
            href={`/notes/${note._id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors active:scale-95"
          >
            <Pencil size={12} />
            Edit
          </Link>

          <button
            onClick={deleteModal.open}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors active:scale-95"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>

      {/* Note body */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          {note.subject}
        </span>

        <h1 className="text-xl font-semibold text-gray-900 mt-2 mb-3 leading-snug">
          {note.title}
        </h1>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="text-xs text-gray-400">{timeAgo(note.createdAt)}</span>
          {note.tags?.length > 0 && (
            <>
              <span className="text-gray-200">·</span>
              <div className="flex gap-1.5 flex-wrap">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-[1.75]">
          {note.content}
        </div>
      </div>

      {/* AI Panel — animated mount */}
      {showAI && (
        <AIPanel
          noteId={note._id}
          initialData={aiData}
          onUpdate={(key, value) => setAiData((prev) => ({ ...prev, [key]: value }))}
        />
      )}

      {/* Delete confirm */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full border border-gray-100 animate-scale-in">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Delete this note?</h3>
            <p className="text-sm text-gray-500 mb-5">
              This note and any AI-generated content will be permanently removed.
            </p>
            <div className="flex gap-2">
              <button
                onClick={deleteModal.close}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors active:scale-95"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
