export default function Footer() {
  return (
    <footer className="px-6 py-3 border-t border-gray-100 bg-white shrink-0">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          Built by{" "}
          <span className="text-gray-700 font-medium">Harshita</span>
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
