import { Spinner } from "@/components/ui/spinner"

export default function LoadingPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner className="h-12 w-12" />
    </div>
  )
}
