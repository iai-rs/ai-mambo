"use client";

import React, { type ReactEventHandler, useState } from "react";
import { modelResultFormatter } from "../../common/Formaters";
import { type PatientData } from "~/types";
import Image from "next/image";
import { api } from "~/trpc/react";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import FeedbackDialog from "./FeedbackDialog";
import { Slider } from "~/components/ui/slider";

type Props = {
  data: PatientData;
  showDetails: boolean;
  showHeatMap: boolean;
  email: string;
};

const ImageWithDetails = ({ data, email, showDetails, showHeatMap }: Props) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [heatOpacity, setHeatOpacity] = useState([100]);
  const { data: imageData } = api.minio.getMinio.useQuery(data.id + ".png");
  // const { data: heatMapData } = api.minio.getMinioHeat.useQuery(
  //   data.id + ".png",
  // );
  const [aspectRatio, setAspectRatio] = useState(0.77); // Default aspect ratio is 1:1

  const handleImageLoad: ReactEventHandler<HTMLImageElement> = (event) => {
    const { naturalWidth, naturalHeight } = event.target as HTMLImageElement;

    setAspectRatio(naturalWidth / naturalHeight);
    setIsImageLoading(false);
  };

  const isLateralityLeft = data.laterality === "L";
  return (
    <div className="rounded-md border border-border bg-background p-2">
      <div className="relative w-[500px]" style={{ aspectRatio }}>
        {(isImageLoading || !imageData?.url) && (
          <Skeleton className="absolute left-0 top-0 h-full w-full" />
        )}
        {imageData?.url && (
          <Image
            width={500}
            height={0}
            src={imageData.url}
            alt="img"
            className="absolute left-0 top-0 h-full w-full"
            onLoad={handleImageLoad}
          />
        )}
        {/* TODO: this should be fixed!!! */}
        {/* {heatMapData?.url && data.id.endsWith("11") && showHeatMap && (
          <Image
            style={{ opacity: (heatOpacity[0] ?? 100) / 100 }}
            width={500}
            height={0}
            src={heatMapData.url}
            alt="heatmap"
            className="absolute left-0 top-0 h-full w-full"
          />
        )} */}
        {/* Image details */}
        {showDetails && !isImageLoading && (
          <div>
            <div
              className={cn(
                data.laterality === "L" ? "right-0 items-end" : "left-0",
                "absolute top-0 m-4 flex flex-col gap-1 text-lg",
              )}
            >
              <Badge className="w-fit" variant="destructive">
                {data.laterality}
                {data.view}
              </Badge>
              <Badge className="w-fit" variant="destructive">
                {modelResultFormatter(data.modelResult as unknown as number)}
              </Badge>
              <Badge variant="destructive">
                <span>{`implant ${data.implant}`}</span>
              </Badge>
              {showHeatMap && (
                <Slider
                  max={100}
                  step={1}
                  value={heatOpacity}
                  onValueChange={setHeatOpacity}
                  className="mt-4 w-20"
                />
              )}
            </div>
            <div
              className={cn(
                "absolute bottom-0 left-0 flex w-full items-baseline justify-between px-2 pb-2 text-xs",
                { ["flex-row-reverse"]: !isLateralityLeft },
              )}
            >
              <span className="text-red-600">{data.id}</span>
              <FeedbackDialog
                imageUrl={imageData?.url}
                email={email}
                studyUid={data.id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageWithDetails;
