"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "History", "Computer Science", "English", "Other",
];

interface Props {
  search: string;
  subject: string;
  onSearch: (v: string) => void;
  onSubject: (v: string) => void;
}

export default function SearchFilter({ search, subject, onSearch, onSubject }: Props) {
  const [input, setInput] = useState(search);
  const debounced = useDebounce(input, 400);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced]);

  return (
    <div className="flex gap-3 flex-col sm:flex-row">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search notes…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
        />
      </div>

      <select
        value={subject}
        onChange={(e) => onSubject(e.target.value)}
        className="py-2 pl-3 pr-8 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition appearance-none cursor-pointer"
      >
        <option value="">All subjects</option>
        {SUBJECTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
