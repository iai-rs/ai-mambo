"use client";

import React, { useState } from "react";
import { FilePenLine } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import MSelect from "~/components/common/MSelect";
import { api } from "~/trpc/react";
import { type BiradsFeedback, birads_classification } from "@prisma/client";
import ImageWithLoader from "~/components/common/ImageWithLoader";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { useRouter } from "next/navigation";

const biradsOptions: birads_classification[] = [
  birads_classification.birads_0,
  birads_classification.birads_1,
  birads_classification.birads_2,
  birads_classification.birads_3,
  birads_classification.birads_4a,
  birads_classification.birads_4b,
  birads_classification.birads_4c,
  birads_classification.birads_5,
  birads_classification.birads_6,
];

type Props = {
  studyUid: string;
  imageUrl: string | undefined;
  email: string;
  feedback: BiradsFeedback | null | undefined;
};

const FeedbackDialog = ({ studyUid, email, imageUrl, feedback }: Props) => {
  const [shadow, setShadow] = useState(feedback?.shadow ?? false);
  const [microcalcifications, setMicrocalcifications] = useState(
    feedback?.microcalcifications ?? false,
  );
  const [symmetry, setSymmetry] = useState(feedback?.symmetry ?? false);
  const [suspectLesion, setSuspectLesion] = useState(
    feedback?.suspect_lesion ?? false,
  );
  const [architectonics, setArchitectonics] = useState(
    feedback?.architectonics ?? false,
  );
  const [birads, setBirads] = useState<birads_classification>(
    feedback?.birads_class ?? birads_classification.birads_0,
  );

  const router = useRouter();
  const createFeedback = api.feedback.createFeedback.useMutation();
  const updateFeedback = api.feedback.updateFeedback.useMutation();

  const handleCreate = async () => {
    try {
      await createFeedback.mutateAsync({
        shadow,
        architectonics,
        birads_class: birads_classification.birads_4a,
        microcalcifications,
        study_uid: studyUid,
        suspect_lesion: suspectLesion,
        symmetry,
        user_email: email,
      });
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    if (!feedback) return;
    try {
      await updateFeedback.mutateAsync({
        id: feedback.id,
        shadow,
        architectonics,
        birads_class: birads_classification.birads_4a,
        microcalcifications,
        study_uid: studyUid,
        suspect_lesion: suspectLesion,
        symmetry,
        user_email: email,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex">
          <Button className="w-fit px-2" variant="outline">
            <FilePenLine className={cn({ "fill-green-500": !!feedback })} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-20px)] overflow-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{"Povratna informacija spec. radiologa"}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <span className="text-xs">{studyUid}</span>
        </DialogDescription>
        <ImageWithLoader url={imageUrl} width={400} height={550} />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Switch
              checked={suspectLesion}
              onCheckedChange={setSuspectLesion}
              id="lesion"
            />
            <Label htmlFor="lesion">{"Suspektna lezija je prisutna"}</Label>
          </div>
          <DialogDescription>
            {"Na snimku su prisutne promene"}
          </DialogDescription>
          <div className="flex items-center gap-1">
            <Switch checked={shadow} onCheckedChange={setShadow} id="shadow" />
            <Label htmlFor="shadow">{"Senka"}</Label>
          </div>
          <div className=" flex items-center gap-1">
            <Switch
              checked={microcalcifications}
              onCheckedChange={setMicrocalcifications}
              id="microcalcifications"
            />
            <Label htmlFor="microcalcifications">{"Mikrokalcifikacije"}</Label>
          </div>
          <div className=" flex items-center gap-1">
            <Switch
              checked={symmetry}
              onCheckedChange={setSymmetry}
              id="symmetry"
            />
            <Label htmlFor="symmetry">{"Simetrija"}</Label>
          </div>
          <div className="flex items-center gap-1">
            <Switch
              checked={architectonics}
              onCheckedChange={setArchitectonics}
              id="architectonics"
            />
            <Label htmlFor="architectonics">{"Arhitektonika"}</Label>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <MSelect
              selectedItem={birads}
              onValueChange={(val) => setBirads(val as birads_classification)}
              items={biradsOptions.map((b) => ({ key: b, label: b }))}
            />
            <Label>{"BIRADS klasifikacija"}</Label>
          </div>
        </div>
        {feedback && (
          <div className="flex flex-wrap text-sm">
            <i className="font-light">prethodno popunio:</i>
            <Badge className="h-fit" variant="outline">
              {feedback.user_email}
            </Badge>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                !!feedback ? void handleUpdate() : void handleCreate();
              }}
              type="button"
            >
              {/* <Spinner /> */}
              <span>{!!feedback ? "Izmeni" : "Sačuvaj"}</span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
