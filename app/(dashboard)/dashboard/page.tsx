import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";
import NoteList from "@/components/notes/NoteList";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; subject?: string }>;
}) {
  const { search, subject } = await searchParams;
  const session = await getServerSession(authOptions);

  await connectDB();

  const query: any = { userId: (session!.user as any).id };
  if (subject) query.subject = { $regex: subject, $options: "i" };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const notes = await Note.find(query)
    .select("title subject tags createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const serialized = JSON.parse(JSON.stringify(notes));
  const subjectCount = new Set(serialized.map((n: any) => n.subject)).size;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Notes</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {serialized.length} {serialized.length === 1 ? "note" : "notes"}
            {subjectCount > 0 && ` · ${subjectCount} ${subjectCount === 1 ? "subject" : "subjects"}`}
          </p>
        </div>

        <Link
          href="/notes/new"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors active:scale-95 duration-150"
        >
          <Plus size={14} strokeWidth={2.5} />
          New note
        </Link>
      </div>

      <NoteList notes={serialized} />
    </div>
  );
}
