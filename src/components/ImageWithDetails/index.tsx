"use client";

import React, { useState } from "react";
import { modelResultFormatter } from "../common/Formaters";
import { type PatientData } from "~/types";
import { Switch } from "../ui/switch";
import Image from "next/image";
import { Label } from "../ui/label";

type Props = {
  data: PatientData;
  url: string;
};

const ImageWithDetails = ({ data, url }: Props) => {
  const [showDetails, setShowDetails] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div>
      <div className="mb-2 flex items-center gap-1">
        <Switch
          checked={showDetails}
          onCheckedChange={setShowDetails}
          id="show-details"
          disabled={!imageLoaded}
        />
        <Label htmlFor="show-details">{"Prikaži rezultate AI pregleda"}</Label>
      </div>
      <div className="relative h-auto w-[500px] text-red-600">
        {!imageLoaded && <div>Slika se učitava</div>}
        <Image
          width={500}
          height={0}
          objectFit="cover"
          src={url}
          alt="img"
          onLoadingComplete={() => setImageLoaded(true)}
        />
        {/* Image details */}
        {showDetails && imageLoaded && (
          <div>
            <div className="absolute left-0 top-0 m-4 flex flex-col gap-1 text-lg ">
              <span>
                {data.laterality}
                {data.view}
              </span>
              <span>
                {modelResultFormatter(data.modelResult as unknown as number)}
              </span>
              <span>{`implant ${data.implant}`}</span>
            </div>
            <div className="absolute bottom-0 left-0 m-2 text-xs">
              {data.id}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageWithDetails;
