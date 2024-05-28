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
    <div className="flex items-center">
      <div
        className={`relative top-[86px] h-[calc(100vh-86px)] border-r border-input bg-white transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        {children}
      </div>

      {/* Content next to Side Menu */}
      <div
        className={`ml-0 flex-grow ${isOpen ? "ml-4" : "ml-0"} transition-margin mt-[140px] h-[calc(100vh-220px)] overflow-x-auto p-4`}
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
