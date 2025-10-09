"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // or a loading skeleton

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "🌞" : "🌛"}
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Passer au mode {theme === "light" ? "sombre" : "clair"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
