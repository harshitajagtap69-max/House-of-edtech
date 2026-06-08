import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required").max(10000),
  subject: z.string().min(1, "Subject is required").max(50),
  tags: z.array(z.string()).optional().default([]),
});

export type NoteInput = z.infer<typeof noteSchema>;
