import Link from "next/link";
import { NoteType } from "@/types";
import { timeAgo } from "@/utils/format";
import { ArrowUpRight } from "lucide-react";

export default function NoteCard({ note }: { note: NoteType }) {
  return (
    <Link href={`/notes/${note._id}`}>
      <article className="animate-slide-up group bg-white border border-gray-100 rounded-xl p-5 cursor-pointer flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:border-gray-200">
        {/* Subject */}
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          {note.subject}
        </span>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1 mb-4 group-hover:text-black transition-colors">
          {note.title}
        </h3>

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-4">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">{timeAgo(note.createdAt)}</span>
          <ArrowUpRight
            size={14}
            className="text-gray-200 group-hover:text-gray-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150"
          />
        </div>
      </article>
    </Link>
  );
}
