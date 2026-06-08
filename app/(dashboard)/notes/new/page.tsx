import NoteForm from "@/components/notes/NoteForm";

export default function NewNotePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">New note</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Add your content, then generate AI insights from the note view.
        </p>
      </div>
      <NoteForm />
    </div>
  );
}
