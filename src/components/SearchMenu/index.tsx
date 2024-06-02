"use client";
import { type ReactNode, useState } from "react";
import { Search, ArrowLeftToLine } from "lucide-react";

import { Button } from "../ui/button";

type Props = {
  children: ReactNode;
  rightContent?: ReactNode;
};

const SideMenu = ({ children, rightContent }: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex items-center overflow-y-hidden">
      <div
        className={`
          relative
          h-[calc(100vh-86px)]
          border-r
          border-input
          bg-white
          transition-transform ${isOpen ? "visible " : "hidden "} min-w-64
        `}
      >
        {children}
      </div>

      {/* Content next to Side Menu */}
      <div
        className={
          `
          ml-0
          max-h-[1000px]
          ${isOpen ? "ml-4" : "ml-0"}
          transition-margin
          overflow-x-auto
          p-4
          `
          // h-[calc(100vh-220px)]
        }
      >
        {rightContent}
      </div>

      {/* Toggle Button */}
      <Button
        variant="outline"
        className={`fixed left-0 top-[90px] ml-1 transform ${
          isOpen ? "translate-x-64" : "translate-x-0"
        } p-2`}
        onClick={toggleMenu}
      >
        {isOpen ? <ArrowLeftToLine /> : <Search />}
      </Button>
    </div>
  );
};

export default SideMenu;
