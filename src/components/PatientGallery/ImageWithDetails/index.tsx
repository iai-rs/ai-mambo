"use client";

import React, { useState } from "react";
import { modelResultFormatter } from "../../common/Formaters";
import { type PatientData } from "~/types";
import Image from "next/image";
import { api } from "~/trpc/react";
import { Skeleton } from "../../ui/skeleton";

type Props = {
  data: PatientData;
  showDetails?: boolean;
};

const ImageWithDetails = ({ data, showDetails = false }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { data: imageData } = api.minio.getMinio.useQuery(data.id + ".png");
  console.log({ data });

  return (
    <div>
      <div className="relative h-auto w-[500px] text-red-600">
        {!imageLoaded && <Skeleton className="h-[700px] w-[500px]" />}
        <Image
          width={500}
          height={0}
          objectFit="cover"
          src={imageData?.url ?? ""}
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
