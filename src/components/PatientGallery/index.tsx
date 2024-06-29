"use client";

import React, { useMemo, useState } from "react";
import ImageWithDetails from "./ImageWithDetails";
import { type PatientData } from "~/types";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

type Props = {
  data: PatientData[];
  email: string;
};

const viewOrder = {
  RMLO: 0,
  LMLO: 1,
  RCC: 2,
  LCC: 3,
};

const PatientGallery = ({ data, email }: Props) => {
  const [showDetails, setShowDetails] = useState(true);
  const [showHeatMap, setShowHeatMap] = useState(false);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aKey = `${a.laterality}${a.view}` as keyof typeof viewOrder;
      const bKey = `${b.laterality}${b.view}` as keyof typeof viewOrder;
      return viewOrder[aKey] - viewOrder[bKey];
    });
  }, [data]);
  console.log({ data, sortedData });

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
        <div className="mb-2 flex items-center gap-1">
          <Switch
            checked={showHeatMap}
            onCheckedChange={setShowHeatMap}
            id="show-heatmap"
          />
          <Label htmlFor="show-details">{"Prikaži hit mapu"}</Label>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedData.map((d) => {
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
