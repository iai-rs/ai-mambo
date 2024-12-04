"use client";

import { ExpandIcon } from "lucide-react";
import ImageWithLoader from "~/components/common/ImageWithLoader";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

type Props = {
  imageUrl: string;
};

const FullImgDialog = ({ imageUrl }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit px-2" variant="outline">
          <ExpandIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[98vh] w-full max-w-screen-lg items-center justify-center p-0">
        <ImageWithLoader url={imageUrl} width={800} height={1000} />
      </DialogContent>
    </Dialog>
  );
};

export default FullImgDialog;
