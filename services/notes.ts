// Client-side note service — all fetch calls in one place
import { NoteType } from "@/types";

type NotePayload = {
  title: string;
  content: string;
  subject: string;
  tags: string[];
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as T;
}

export const noteService = {
  create: (payload: NotePayload) =>
    request<{ note: NoteType }>("/api/notes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: NotePayload) =>
    request<{ note: NoteType }>(`/api/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    request<{ message: string }>(`/api/notes/${id}`, { method: "DELETE" }),

  generateAll: (noteId: string) =>
    request<{
      summary: string;
      keyPoints: string[];
      questions: string[];
    }>("/api/ai", {
      method: "POST",
      body: JSON.stringify({ noteId, feature: "all" }),
    }),

  generate: (noteId: string, feature: "summary" | "keypoints" | "questions") =>
    request<{ result: string | string[] }>("/api/ai", {
      method: "POST",
      body: JSON.stringify({ noteId, feature }),
    }),
};
