import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext.jsx";

export default function AppSettings() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-medium">Dark Mode</span>
        <span className="text-xs text-muted-foreground">
          Aktifkan tema gelap untuk aplikasi.
        </span>
      </div>

      <Switch
        checked={darkMode}
        onCheckedChange={(value) => setDarkMode(value)}
      />
    </div>
  );
}
