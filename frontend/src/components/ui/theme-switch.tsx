import { useTheme } from "@/context/theme";
import { Sun, Moon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="size-9" />;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
