"use client";

import React, { useState } from "react";
import ImageWithDetails from "./ImageWithDetails";
import { type PatientData } from "~/types";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

type Props = {
  data: PatientData[];
  email: string;
};

const PatientGallery = ({ data, email }: Props) => {
  const [showDetails, setShowDetails] = useState(true);
  const [showHeatMap, setShowHeatMap] = useState(false);
  return (
    <div className="pb-4">
      <div className="flex gap-4">
        <div className="mb-2 flex items-center gap-1">
          <Switch
            checked={showDetails}
            onCheckedChange={setShowDetails}
            id="show-details"
          />
          <Label htmlFor="show-details">{"Prikaži anotacije"}</Label>
        </div>
        {/* <div className="mb-2 flex items-center gap-1">
          <Switch
            checked={showHeatMap}
            onCheckedChange={setShowHeatMap}
            id="show-heatmap"
          />
          <Label htmlFor="show-details">{"Prikaži hit mapu"}</Label>
        </div> */}
      </div>
      <div className="flex flex-wrap gap-2">
        {data.map((d) => {
          return (
            <ImageWithDetails
              key={d.id}
              data={d}
              showDetails={showDetails}
              showHeatMap={showHeatMap}
              email={email}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PatientGallery;
