import { useSidebar } from "@/components/ui/sidebar"; 
import { Button } from "@/components/ui/button"; 
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"; 
import { Separator } from "@/components/ui/separator";

// Komponen header utama
export default function Header() {
    const { open, toggleSidebar } = useSidebar(); // ambil status & fungsi toggle sidebar

    return (
        <header className="flex items-center justify-between border-b bg-background px-4 py-2">
            {/* Tombol untuk membuka/menutup sidebar */}
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="hover:bg-muted p-0 h-8 w-8 flex items-center justify-center"
                >
                    {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                </Button>
            </div>

            {/* Teks versi aplikasi */}
            <div className="text-xs text-muted-foreground">v1.0</div>
        </header>
    );
}
