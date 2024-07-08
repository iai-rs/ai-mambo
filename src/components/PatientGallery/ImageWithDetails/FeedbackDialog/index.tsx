/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import React, { useEffect, useState } from "react";
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

const lookupBirads: Record<birads_classification, string> = {
  [birads_classification.birads_0]: "birads 0",
  [birads_classification.birads_1]: "birads 1",
  [birads_classification.birads_2]: "birads 2",
  [birads_classification.birads_3]: "birads 3",
  [birads_classification.birads_4a]: "birads 4a",
  [birads_classification.birads_4b]: "birads 4b",
  [birads_classification.birads_4c]: "birads 4c",
  [birads_classification.birads_5]: "birads 5",
  [birads_classification.birads_6]: "birads 6",
  [birads_classification.na]: "nije primenjivo",
};

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
  birads_classification.na,
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

  const handleResetState = () => {
    setShadow(feedback?.shadow ?? false);
    setMicrocalcifications(feedback?.microcalcifications ?? false);
    setSymmetry(feedback?.symmetry ?? false);
    setArchitectonics(feedback?.architectonics ?? false);
  };

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
        birads_class: birads,
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

  useEffect(() => {
    if (shadow || microcalcifications || architectonics || symmetry) {
      setSuspectLesion(true);
    } else {
      setSuspectLesion(false);
    }
  }, [architectonics, microcalcifications, shadow, symmetry]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          handleResetState();
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="flex">
          <Button className="w-fit px-2" variant="outline">
            <FilePenLine className={cn({ "fill-green-500": !!feedback })} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-20px)] overflow-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{"Analiza radiologa"}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <span className="text-xs">{studyUid}</span>
        </DialogDescription>
        <ImageWithLoader url={imageUrl} width={400} height={550} />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Switch aria-readonly checked={suspectLesion} id="lesion" />
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
              items={biradsOptions.map((b) => ({
                key: b,
                label: lookupBirads[b],
              }))}
            />
            <Label>{"BIRADS klasifikacija"}</Label>
          </div>
        </div>
        {feedback && (
          <div className="flex flex-col rounded-sm border border-red-500 bg-red-100/50 p-2">
            <div className=" flex flex-wrap items-center text-sm">
              <i className="font-light">prethodno popunio:</i>
              <Badge className="h-fit p-1" variant="secondary">
                {feedback.user_email}
              </Badge>
            </div>
            {feedback.createdAt && (
              <i className="text-xs">{feedback.createdAt.toLocaleString()}</i>
            )}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Zatvori</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={
                !suspectLesion && birads === birads_classification.birads_0
              }
              onClick={() => {
                !!feedback ? void handleUpdate() : void handleCreate();
              }}
              type="button"
            >
              <span>{!!feedback ? "Izmeni" : "Sačuvaj"}</span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
