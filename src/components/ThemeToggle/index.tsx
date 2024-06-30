"use client";

import { Moon, Sun } from "lucide-react";
import { useState, useEffect, type MouseEventHandler } from "react";
import { Button } from "../ui/button";
import { iconHeight } from "~/constants";

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

  const toggleTheme: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
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
    <Button
      className="h-fit w-full justify-start p-0"
      variant="ghost"
      onClick={toggleTheme}
    >
      <div className="flex items-center gap-4">
        {isDark ? <Sun height={iconHeight} /> : <Moon height={iconHeight} />}
        <span>{isDark ? "Svetlo" : "Tamno"}</span>
      </div>
    </Button>
  );
}

export default ThemeToggle;
