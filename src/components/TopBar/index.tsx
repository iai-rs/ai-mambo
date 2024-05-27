import React from "react";
import IorsLogo from "../../../public/iors_logo.png";
import Image from "next/image";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

const TopBar = () => {
  return (
    <div className="fixed w-full bg-muted p-2">
      <div className="flex items-center justify-between">
        <Image src={IorsLogo} alt="iors" />
        <Avatar>
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default TopBar;
