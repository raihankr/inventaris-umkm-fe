import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      {/* Title */}
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
        Inventaris UMKM
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-lg text-muted-foreground max-w-xl">
        Sistem inventaris sederhana untuk membantu UMKM mengelola barang,
        stok, dan aset usaha dengan mudah dan efisien.
      </p>

      {/* CTA Button */}
      <Link to="/login">
        <Button className="mt-6 px-6 py-2 text-base">
          Login
        </Button>
      </Link>

      {/* Footer small text */}
      <p className="mt-10 text-sm text-muted-foreground">
        v1.0 
      </p>
    </div>
  )
}
