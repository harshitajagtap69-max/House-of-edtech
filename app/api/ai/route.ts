import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import {
  generateAll,
  generateSummary,
  generateKeyPoints,
  generateQuestions,
} from "@/lib/groq";
import { z } from "zod";

const schema = z.object({
  noteId: z.string().min(1),
  feature: z.enum(["summary", "keypoints", "questions", "all"]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { noteId, feature } = parsed.data;
    const userId = (session.user as any).id;

    await connectDB();

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.content.trim().length < 50) {
      return NextResponse.json(
        { error: "Note is too short. Add more content before generating AI insights." },
        { status: 400 }
      );
    }

    // Generate all three in a single AI call
    if (feature === "all") {
      const result = await generateAll(note.content);
      note.aiSummary = result.summary;
      note.aiKeyPoints = result.keyPoints;
      note.aiQuestions = result.questions;
      await note.save();

      return NextResponse.json({
        summary: result.summary,
        keyPoints: result.keyPoints,
        questions: result.questions,
      });
    }

    // Individual generation
    let result: string | string[];

    if (feature === "summary") {
      result = await generateSummary(note.content);
      note.aiSummary = result as string;
    } else if (feature === "keypoints") {
      result = await generateKeyPoints(note.content);
      note.aiKeyPoints = result as string[];
    } else {
      result = await generateQuestions(note.content);
      note.aiQuestions = result as string[];
    }

    await note.save();

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("[AI route error]", error?.message ?? error);

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "AI rate limit reached. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate AI content." },
      { status: 500 }
    );
  }
}
