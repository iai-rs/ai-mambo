import React from "react";
import IorsLogo from "../../../public/iors_logo.png";
import Image from "next/image";
import UserMenu from "./UserMenu";

const TopBar = () => {
  return (
    <div className="sticky w-full bg-muted p-2">
      <div className="flex items-center justify-between">
        <div className="w-[300px] rounded-md bg-gradient-to-r from-[#F1F5F9] to-muted p-2">
          <Image src={IorsLogo} alt="iors" height={60} />
        </div>
        <UserMenu />
      </div>
    </div>
  );
};

export default TopBar;
