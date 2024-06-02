import React from "react";
import IorsLogo from "../../../public/iors_logo.png";
import Image from "next/image";
import SignedUser from "./SignedUser";

const TopBar = () => {
  return (
    <div className="sticky w-full bg-muted p-2">
      <div className="flex items-center justify-between">
        <Image src={IorsLogo} alt="iors" />
        <div className="flex gap-2">
          <SignedUser />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
