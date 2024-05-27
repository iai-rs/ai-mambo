"use client";
import { type ReactNode, useState } from "react";
import {
  Search,
  ArrowLeftRight,
  ArrowLeftToLine,
  ArrowRightToLine,
} from "lucide-react";

import { Button } from "../ui/button";

type Props = {
  children: ReactNode;
};

const SideMenu = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Side Menu */}
      <div
        className={`fixed left-0 top-[86px] h-[calc(100%-86px)] border-r border-input  bg-white transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        {children}
      </div>

      {/* Toggle Button */}
      <Button
        variant="outline"
        className={`fixed left-0 top-[90px] ml-1 transform ${
          isOpen ? "translate-x-64" : "translate-x-0"
        }  p-2 `}
        onClick={toggleMenu}
      >
        {isOpen ? <ArrowLeftToLine /> : <Search />}
      </Button>
    </div>
  );
};

export default SideMenu;
