import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext.jsx";
import { Label } from "@/components/ui/label";

export default function AppSettings() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="flex flex-col gap-4" autoComplete="off">
      
      {/* Section Dark Mode */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-lg font-medium">Appearance</h3>
        
        <div className="flex items-center gap-4">
          <Label htmlFor="dark-mode" className="w-48">Dark Mode</Label>
          <div className="flex-1 flex justify-end">
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={(value) => setDarkMode(value)}
            />
          </div>
        </div>
        
        <div className="flex gap-4 items-start">
          <span className="text-xs text-muted-foreground flex-1">
            Aktifkan tema gelap untuk aplikasi.
          </span>
        </div>
      </div>
      
    </div>
  );
}