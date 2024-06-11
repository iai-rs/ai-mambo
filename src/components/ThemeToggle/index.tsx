"use client";

import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  const isDark = theme === "dark";

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setTheme("dark");
    }
  };

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      <div className="flex items-center gap-2">
        <span>{isDark ? "Svetla tema" : "Tamna tema"}</span>
        {isDark ? <Sun /> : <Moon />}
      </div>
    </Button>
  );
}

export default ThemeToggle;
