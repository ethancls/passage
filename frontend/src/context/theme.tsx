import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "light" });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const getPreferred = (): "light" | "dark" =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  const [theme, setTheme] = useState<"light" | "dark">(getPreferred());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (t: "light" | "dark") => {
      const root = document.documentElement;
      root.classList.toggle("dark", t === "dark");
    };
    apply(theme);
    const listener = (e: MediaQueryListEvent) => {
      const next = e.matches ? "dark" : "light";
      setTheme(next);
      apply(next);
    };
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
