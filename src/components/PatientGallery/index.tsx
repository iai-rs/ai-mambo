"use client";

import React, { useMemo, useState } from "react";

import ImageWithDetails from "./ImageWithDetails";
import { type PatientData } from "~/types";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import dynamic from "next/dynamic";

const PDFCreatorDetail = dynamic(() => import("../common/PDFCreator/Detail"), {
  ssr: false,
});

type Props = {
  data: PatientData[];
  email: string;
  role: string;
};

function sortPatientDataForGrid(data: PatientData[]): PatientData[] {
  const leftLateralityPriority = ["RMLO", "RCC", "R"]; // Include 'R' for fallback
  const rightLateralityMap: Record<string, string> = {
    RMLO: "LMLO",
    RCC: "LCC",
    R: "L", // Fallback: R pairs with L
  };

  // Preprocess: Combine `laterality` and `view` (if available)
  const processedData = data.map((item) => ({
    ...item,
    mergedLaterality:
      `${item.laterality ?? ""}${item.view ?? ""}`.toUpperCase(), // Combine and standardize
  }));

  // Split data into left and right images
  const leftImages = processedData.filter(
    (item) =>
      leftLateralityPriority.includes(item.mergedLaterality) ||
      item.laterality === "R",
  );
  const rightImages = processedData.filter(
    (item) =>
      Object.values(rightLateralityMap).includes(item.mergedLaterality) ||
      item.laterality === "L",
  );

  const sortedGrid: PatientData[] = [];
  const unmatched: PatientData[] = [...processedData]; // Track unmatched images

  // Match left images with corresponding right images
  for (const left of leftImages) {
    const correspondingRight = rightImages.find(
      (right) =>
        right.mergedLaterality === rightLateralityMap[left.mergedLaterality] || // Standard rule
        (left.laterality === "R" && right.laterality === "L"), // Fallback rule
    );

    if (correspondingRight) {
      // Add the matched pair to the grid
      sortedGrid.push(left, correspondingRight);

      // Remove matched items from the unmatched list
      unmatched.splice(unmatched.indexOf(left), 1);
      unmatched.splice(unmatched.indexOf(correspondingRight), 1);

      // Remove the matched right image to avoid duplication
      const index = rightImages.indexOf(correspondingRight);
      rightImages.splice(index, 1);
    }
  }

  // Append unmatched images at the end
  return [...sortedGrid, ...unmatched];
}

const PatientGallery = ({ data, email, role }: Props) => {
  const [showDetails, setShowDetails] = useState(true);
  const [showHeatMap, setShowHeatMap] = useState(false);

  const sortedData = useMemo(() => sortPatientDataForGrid(data), [data]);

  return (
    <div className="pb-4">
      <div className="flex items-center gap-4 py-2">
        <div className="flex items-center gap-1">
          <Switch
            checked={showDetails}
            onCheckedChange={setShowDetails}
            id="show-details"
          />
          <Label htmlFor="show-details">{"Prikaži anotacije"}</Label>
        </div>
        <div className="flex items-center gap-1">
          <Switch
            checked={showHeatMap}
            onCheckedChange={setShowHeatMap}
            id="show-heatmap"
          />
          <Label htmlFor="show-heatmap">{"Prikaži hit mapu"}</Label>
        </div>
        <PDFCreatorDetail data={data} />
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
              role={role}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PatientGallery;
