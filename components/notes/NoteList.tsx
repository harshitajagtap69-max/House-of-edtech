"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import NoteCard from "./NoteCard";
import SearchFilter from "./SearchFilter";
import { NoteType } from "@/types";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function NoteList({ notes }: { notes: NoteType[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  return (
    <div>
      <SearchFilter
        search={searchParams.get("search") ?? ""}
        subject={searchParams.get("subject") ?? ""}
        onSearch={(v) => setParam("search", v)}
        onSubject={(v) => setParam("subject", v)}
      />

      {notes.length === 0 ? (
        <div className="animate-fade-in flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mb-4">
            <FileText size={18} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">No notes yet</p>
          <p className="text-sm text-gray-400 mb-5">
            Create your first note and let AI do the studying.
          </p>
          <Link
            href="/notes/new"
            className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-900 transition-colors"
          >
            Create note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5 stagger-children">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
