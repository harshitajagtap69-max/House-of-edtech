import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
      <p className="text-sm font-medium text-gray-400 mb-2">404</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Page not found</h1>
      <p className="text-sm text-gray-400 mb-6">
        This note or page doesn&apos;t exist.
      </p>
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-900 transition"
      >
        Back to notes
      </Link>
    </div>
  );
}
