"use client";

import React, { type Dispatch, type SetStateAction } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type Props = {
  setFromBeginningOfYear: Dispatch<SetStateAction<boolean>>;
  setAllData: Dispatch<SetStateAction<boolean>>;
  setDays: Dispatch<SetStateAction<number>>;
  patientId: string;
  patientName: string;
  setPatientId: Dispatch<SetStateAction<string>>;
  setPatientName: Dispatch<SetStateAction<string>>;
  handleSearch: () => void;
};

const SearchMenu = ({
  handleSearch,
  patientId,
  patientName,
  setPatientName,
  setPatientId,
  setDays,
  setAllData,
  setFromBeginningOfYear,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <h2 className="mb-4 text-lg">{"PRETRAGA PREGLEDA"}</h2>
      <RadioGroup
        defaultValue="allData"
        onValueChange={(val) => {
          if (val === "startOfYear") {
            setFromBeginningOfYear(true);
            setAllData(false);
          }
          if (val === "allData") {
            setAllData(true);
            setFromBeginningOfYear(false);
          }
          if (!isNaN(Number(val))) {
            setDays(Number(val));
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="7" id="r1" />
          <Label htmlFor="r1">{"7 dana"}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="30" id="r2" />
          <Label htmlFor="r2">{"30 dana"}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="startOfYear" id="r3" />
          <Label htmlFor="r3">{"Od početka godine"}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="allData" id="r4" />
          <Label htmlFor="r4">{"Sve"}</Label>
        </div>
      </RadioGroup>
      {/* JMBG */}
      <div className="mt-4">
        <Label>{"Pretraga po JMBG"}</Label>
        <Input
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
      </div>
      {/* NAME */}
      <div className="mt-4">
        <Label>{"Pretraga po imenu"}</Label>
        <Input
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </div>
      <Button onClick={() => handleSearch()}>PRETRAGA</Button>
    </div>
  );
};

export default SearchMenu;
