import React from "react";
import Image from "next/image";
import Link from "next/link";

import IorsLogo from "../../../public/images/iors_logo.png";
import IviLogo from "../../../public/images/ivi-logo.svg";
import MzLogo from "../../../public/images/mz-logo.png";

import UserMenu from "./UserMenu";

const LogosHeight = 60;

const TopBar = () => {
  return (
    <div className="sticky w-full bg-muted p-2">
      <div className="flex items-center justify-between gap-10">
        <div className="flex w-full justify-between">
          {/* IORS */}
          <div className="rounded-md bg-gradient-to-r from-[#F1F5F9] to-muted p-2">
            <Link href="/">
              <Image src={IorsLogo} alt="iors logo" height={LogosHeight} />
            </Link>
          </div>
          <div className="flex hidden gap-4 text-sm md:flex">
            {/* MZ */}
            <div className="flex items-center gap-2">
              <Image
                src={MzLogo}
                alt="ministarstvo zdravlja logo"
                height={50}
              />
              <div className="flex flex-col leading-5">
                <strong>{"Република Србија"}</strong>
                <span>{"Министарство Здравља".toUpperCase()}</span>
              </div>
            </div>
            {/* IVI */}
            <div className="flex items-center gap-2">
              <Image src={IviLogo} alt="ivi logo" height={40} />
              <div className="flex flex-col leading-5">
                <span>{"Istraživačko-razvojni institut"}</span>
                <span>{"za veštačku inteligenciju Srbije"}</span>
              </div>
            </div>
          </div>
        </div>
        <UserMenu />
      </div>
    </div>
  );
};

export default TopBar;
