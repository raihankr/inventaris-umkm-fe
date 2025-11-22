import { useSidebar } from "@/components/ui/sidebar"; 
import { Button } from "@/components/reusable/button"; 
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"; 
import { useLocation, Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Header() {
  const { open, toggleSidebar } = useSidebar();
  const location = useLocation();

  // list path dari URL -> ["inventory", "list", "detail"]
  const pathnames = location.pathname.split("/").filter((p) => p);

  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-2">
      
      {/* Toggle + Breadcrumb (Kiri)*/}
      <div className="flex items-center gap-3">

        {/* Tombol buka/tutup sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-muted p-0 h-8 w-8 flex items-center justify-center"
        >
          {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </Button>

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>

            {pathnames.map((name, idx) => {
              const routeTo = "/" + pathnames.slice(0, idx + 1).join("/");
              const isLast = idx === pathnames.length - 1;

              return (
                <div key={routeTo} className="flex items-center">
                  <BreadcrumbSeparator />
                  {isLast ? (
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">
                        {name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to={routeTo} className="capitalize">
                          {name}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* versi aplikasi (kanan) */}
      <div className="text-xs text-muted-foreground">v1.0</div>
    </header>
  );
}
