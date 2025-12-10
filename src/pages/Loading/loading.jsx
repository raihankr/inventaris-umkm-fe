import { Spinner } from "@/components/ui/spinner";

export default function LoadingPage({ full }) {
  return (
    <div
      className={`w-full ${full ? "h-full" : "h-screen"} p-20 flex items-center justify-center`}
    >
      <Spinner className="h-12 w-12" />
    </div>
  );
}
