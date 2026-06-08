"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { noteSchema } from "@/validators/noteSchema";
import { noteService } from "@/services/notes";
import toast from "react-hot-toast";
import { NoteType } from "@/types";
import { X } from "lucide-react";

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "History", "Computer Science", "English", "Other",
];

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition";

export default function NoteForm({ note }: { note?: NoteType }) {
  const router = useRouter();
  const isEdit = !!note;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(note?.tags ?? []);

  function addTag(e: React.KeyboardEvent) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = tagInput.trim();
    if (val && !tags.includes(val) && tags.length < 5) {
      setTags((prev) => [...prev, val]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title") as string,
      content: form.get("content") as string,
      subject: form.get("subject") as string,
      tags,
    };

    const parsed = noteSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i: any) => {
        if (i.path[0]) errs[i.path[0]] = i.message;
      });
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await noteService.update(note._id, parsed.data);
        toast.success("Note updated");
        router.push(`/notes/${note._id}`);
      } else {
        const res = await noteService.create(parsed.data);
        toast.success("Note created");
        router.push(`/notes/${res.note._id}`);
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
        <input
          name="title"
          defaultValue={note?.title}
          placeholder="e.g. Chapter 4 — Thermodynamics"
          className={inputClass}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
        <select name="subject" defaultValue={note?.subject ?? ""} className={inputClass}>
          <option value="">Select subject</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <span className="text-xs text-gray-400">Min. 50 chars for AI</span>
        </div>
        <textarea
          name="content"
          defaultValue={note?.content}
          rows={12}
          placeholder="Write or paste your study notes here…"
          className={`${inputClass} resize-none leading-relaxed`}
        />
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Tags{" "}
          <span className="font-normal text-gray-400">(Enter to add, max 5)</span>
        </label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="e.g. exam, revision"
          className={inputClass}
        />
        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-400 hover:text-gray-700 transition"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Saving…" : isEdit ? "Update note" : "Save note"}
        </button>
      </div>
    </form>
  );
}
