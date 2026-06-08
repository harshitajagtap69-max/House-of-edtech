"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { noteService } from "@/services/notes";
import { Sparkles, Loader2, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { cn } from "@/utils/cn";

interface AIData {
  aiSummary?: string;
  aiKeyPoints?: string[];
  aiQuestions?: string[];
}

interface Props {
  noteId: string;
  initialData: AIData;
  onUpdate: (key: string, value: any) => void;
}

type Tab = "summary" | "keypoints" | "questions";

const tabs: { key: Tab; label: string; emoji: string }[] = [
  { key: "summary",   label: "Summary",    emoji: "📝" },
  { key: "keypoints", label: "Key points", emoji: "🎯" },
  { key: "questions", label: "Questions",  emoji: "❓" },
];

export default function AIPanel({ noteId, initialData, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [data, setData] = useState<AIData>(initialData);

  const hasAny = data.aiSummary || data.aiKeyPoints?.length || data.aiQuestions?.length;

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await noteService.generateAll(noteId);
      const updated: AIData = {
        aiSummary: result.summary,
        aiKeyPoints: result.keyPoints,
        aiQuestions: result.questions,
      };
      setData(updated);
      onUpdate("aiSummary", result.summary);
      onUpdate("aiKeyPoints", result.keyPoints);
      onUpdate("aiQuestions", result.questions);
      setActiveTab("summary");
      toast.success("Insights ready");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to generate insights");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-slide-up border border-gray-100 rounded-xl overflow-hidden bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">AI Insights</span>
          {hasAny && !loading && (
            <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md font-medium ml-1">
              Generated
            </span>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
            loading
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : hasAny
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "bg-black text-white hover:bg-gray-800 active:scale-95"
          )}
        >
          {loading ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Working…
            </>
          ) : hasAny ? (
            <>
              <RotateCcw size={12} />
              Regenerate
            </>
          ) : (
            <>
              <Sparkles size={12} />
              Generate
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      {hasAny && !loading && (
        <div className="flex border-b border-gray-100 px-5">
          {tabs.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "relative py-3 mr-6 text-xs font-medium transition-colors duration-150",
                activeTab === key ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
              )}
            >
              {emoji} {label}
              {activeTab === key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-5 min-h-[120px]">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-3 animate-fade-in">
            <div className="relative">
              <Sparkles size={20} className="text-gray-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full animate-ping" />
            </div>
            <p className="text-sm text-gray-400">Analyzing your notes…</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !hasAny && (
          <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in">
            <p className="text-sm text-gray-400 leading-relaxed">
              Hit <span className="text-gray-700 font-medium">Generate</span> to get a summary,
              key points, and exam questions in one go.
            </p>
          </div>
        )}

        {/* Summary */}
        {!loading && activeTab === "summary" && data.aiSummary && (
          <p className="text-sm text-gray-700 leading-relaxed animate-fade-in">
            {data.aiSummary}
          </p>
        )}

        {/* Key Points */}
        {!loading && activeTab === "keypoints" && data.aiKeyPoints && (
          <ol className="space-y-3 animate-fade-in">
            {data.aiKeyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <span className="text-[11px] font-bold text-gray-300 pt-0.5 w-4 shrink-0 group-hover:text-gray-500 transition-colors">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
              </li>
            ))}
          </ol>
        )}

        {/* Questions */}
        {!loading && activeTab === "questions" && data.aiQuestions && (
          <div className="space-y-2 animate-fade-in">
            {data.aiQuestions.map((q, i) => (
              <QuestionItem key={i} index={i + 1} question={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionItem({ index, question }: { index: number; question: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="w-full text-left px-4 py-3 border border-gray-100 rounded-lg hover:border-gray-200 hover:bg-gray-50 transition-all duration-150 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-gray-700 text-left">
          <span className="text-xs font-semibold text-gray-300 mr-2">Q{index}</span>
          {question}
        </p>
        <span className="text-gray-300 shrink-0 mt-0.5 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <ChevronDown size={14} />
        </span>
      </div>
      {open && (
        <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100 text-left animate-slide-down">
          Try to recall the answer from your notes before looking it up.
        </p>
      )}
    </button>
  );
}
