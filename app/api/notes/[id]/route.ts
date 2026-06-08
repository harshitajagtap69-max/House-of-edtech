import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { noteSchema } from "@/validators/noteSchema";
import mongoose from "mongoose";

async function getOwnedNote(id: string, userId: string) {
  if (!mongoose.isValidObjectId(id)) return null;
  const note = await Note.findOne({ _id: id, userId });
  return note;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const note = await getOwnedNote(id, (session.user as any).id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("[GET /api/notes/:id]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();
    const note = await getOwnedNote(id, (session.user as any).id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    note.title = parsed.data.title;
    note.content = parsed.data.content;
    note.subject = parsed.data.subject;
    note.tags = parsed.data.tags ?? [];
    await note.save();

    return NextResponse.json({ note });
  } catch (error) {
    console.error("[PUT /api/notes/:id]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const note = await getOwnedNote(id, (session.user as any).id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await note.deleteOne();
    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    console.error("[DELETE /api/notes/:id]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
