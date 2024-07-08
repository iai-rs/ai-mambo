"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { iconHeight } from "~/constants";
import { useTheme } from "~/contexts/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

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
