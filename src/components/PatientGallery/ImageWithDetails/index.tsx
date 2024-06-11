"use client";

import React, { useState } from "react";
import { modelResultFormatter } from "../../common/Formaters";
import { type PatientData } from "~/types";
import Image from "next/image";
import { api } from "~/trpc/react";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";

type Props = {
  data: PatientData;
  showDetails?: boolean;
};

const ImageWithDetails = ({ data, showDetails = false }: Props) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { data: imageData } = api.minio.getMinio.useQuery(data.id + ".png");

  return (
    <div>
      <div className="relative min-h-[500px] w-[500px]">
        {(isImageLoading || !imageData?.url) && (
          <Skeleton className="h-[700px] w-[500px]" />
        )}
        {imageData?.url && (
          <Image
            width={500}
            height={0}
            // objectFit="cover"
            src={imageData.url}
            alt="img"
            onLoad={() => setIsImageLoading(false)}
          />
        )}
        {/* Image details */}
        {showDetails && !isImageLoading && (
          <div>
            <div
              className={cn(
                data.laterality === "L" ? "right-0 items-end" : "left-0",
                "absolute  top-0 m-4 flex flex-col gap-1 text-lg ",
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
            </div>
            <div className="absolute bottom-0 left-0 m-2 text-xs text-red-600">
              {data.id}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageWithDetails;