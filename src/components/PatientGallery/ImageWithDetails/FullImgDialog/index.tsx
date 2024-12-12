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
      <DialogContent className="flex h-[100vh] w-full max-w-screen-lg items-center justify-center p-0">
        <div className="overflow-auto p-3">
          <ImageWithLoader url={imageUrl} width={800} height={1000} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullImgDialog;
