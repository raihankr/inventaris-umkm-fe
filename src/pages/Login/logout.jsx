import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiLogout } from "@/lib/api";
import { GET_LOGOUT } from "@/constants/api/login";

export default function Logout() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try { // WORKFLOWWWWWWWW SHEESHHH
      // 1. PANGGIL API LOGOUT - INI YANG UTAMA
      const result = await apiLogout(GET_LOGOUT);

      // 2. CEK JIKA API RETURN ERROR
      if (result.error) {
        setError(result.message || "Gagal melakukan logout. Coba lagi.");
        setLoading(false);
        return; // STOP 
      }

      // 3. JIKA API SUKSES, BARU CLEAR STORAGE
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("auth");
      sessionStorage.clear();

      // 4. REDIRECT KE LOGIN
      window.location.href = "/login";

    } catch (err) {
      console.error("Logout error:", err);
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setError(null);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="w-full px-3 py-2 rounded-md hover:bg-accent text-sm text-left text-red-600">
          Logout
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[420px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Keluar dari akun?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan keluar dari aplikasi dan harus login kembali untuk mengaksesnya.
            Apakah Anda yakin ingin keluar?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* TAMPILKAN ERROR JIKA API GAGAL */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Gagal Logout</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Yes, logout"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}