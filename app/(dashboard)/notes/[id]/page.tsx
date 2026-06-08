import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import { notFound } from "next/navigation";
import NoteDetail from "@/components/notes/NoteDetail";
import mongoose from "mongoose";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) notFound();

  const session = await getServerSession(authOptions);
  await connectDB();

  const note = await Note.findOne({
    _id: id,
    userId: (session!.user as any).id,
  }).lean();

  if (!note) notFound();

  const serialized = JSON.parse(JSON.stringify(note));

  return <NoteDetail note={serialized} />;
}
