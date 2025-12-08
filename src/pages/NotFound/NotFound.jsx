import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center px-4">
      {/* SVG Inline dengan currentColor */}
      <svg
        className="w-40 h-40 mb-6 text-foreground" // dark mode
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 9L9 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 9L15 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <h1 className="text-4xl font-bold mb-2">404</h1>

      <p className="text-muted-foreground mb-6">
        Halaman yang kamu cari tidak ditemukan.
      </p>

      <Link
        to="/"
        replace
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  )
}
