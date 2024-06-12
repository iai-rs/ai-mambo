"use client";

import React, { useState } from "react";
import { Copy, FilePenLine } from "lucide-react";

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

type Birads = "1" | "2" | "3" | "4a" | "4b" | "4c" | "5" | "6";
const biradsOptions: Birads[] = ["1", "2", "3", "4a", "4b", "4c", "5", "6"];

type Props = {
  studyUid: string;
  email: string;
};

const FeedbackDialog = ({ studyUid, email }: Props) => {
  const [shadow, setShadow] = useState(false);
  const [microcalcifications, setMicrocalcifications] = useState(false);
  const [symmetry, setSymmetry] = useState(false);
  const [suspectLesion, setSuspectLesion] = useState(false);
  const [architectonics, setArchitectonics] = useState(false);
  const [birads, setBirads] = useState<Birads>("1");

  const addFeedback = api.feedback.addFeedback.useMutation();

  const handleSave = async () => {
    try {
      const res = await addFeedback.mutateAsync({
        shadow,
        architectonics,
        birads_class: birads,
        microcalcifications,
        study_uid: studyUid,
        suspect_lesion: suspectLesion,
        symmetry,
        user_email: email,
      });
      console.log({ res });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit px-2" variant="outline">
          <FilePenLine />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{"Povratna informacija spec. radiologa"}</DialogTitle>
        </DialogHeader>
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
              onValueChange={(val) => setBirads(val as Birads)}
              items={biradsOptions.map((b) => ({ key: b, label: b }))}
            />
            <Label>{"BIRADS klasifikacija"}</Label>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button onClick={handleSave} type="button">
              Sačuvaj
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
