import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

type Props = {
  url: string | undefined;
  width?: number;
  height?: number;
};

const ImageWithLoader = ({ url, width = 500, height = 650 }: Props) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  return (
    <>
      {(isImageLoading || !url) && <Skeleton style={{ width, height }} />}
      {url && (
        <Image
          width={500}
          height={0}
          src={url}
          alt="img"
          onLoad={() => setIsImageLoading(false)}
        />
      )}
    </>
  );
};

export default ImageWithLoader;
