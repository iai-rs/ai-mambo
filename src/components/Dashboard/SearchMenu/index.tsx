"use client";

import React, { type Dispatch, type SetStateAction } from "react";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { type SearchType } from "~/types";
import RangePicker, { type RangePickerProps } from "./RangePicker";
import { Switch } from "~/components/ui/switch";

type Props = {
  patientId: string;
  patientName: string;
  isCustomDate: boolean;
  setIsCustomDate: Dispatch<SetStateAction<boolean>>;
  setPatientId: Dispatch<SetStateAction<string>>;
  setPatientName: Dispatch<SetStateAction<string>>;
  setSearch: Dispatch<SetStateAction<SearchType>>;
  search: SearchType;
  customDate: RangePickerProps["date"] | undefined;
  setCustomDate: RangePickerProps["setDate"];
  handleSearch: () => void;
};

const SearchMenu = ({
  customDate,
  setCustomDate,
  handleSearch,
  patientId,
  isCustomDate,
  setIsCustomDate,
  patientName,
  setPatientName,
  setPatientId,
  setSearch,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      <h2 className="mb-4 text-lg">{"PRETRAGA PREGLEDA"}</h2>
      <RadioGroup
        disabled={isCustomDate}
        defaultValue="allData"
        onValueChange={(val) => {
          setSearch(val as SearchType);
        }}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="today" id="r1" />
          <Label htmlFor="r1">{"Danas"}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="7" id="r2" />
          <Label htmlFor="r2">{"7 dana"}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="30" id="r3" />
          <Label htmlFor="r3">{"30 dana"}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="startOfYear" id="r4" />
          <Label htmlFor="r4">{"Od početka godine"}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="allData" id="r5" />
          <Label htmlFor="r5">{"Sve"}</Label>
        </div>
      </RadioGroup>
      <div className="my-4 flex items-center gap-1">
        <Switch
          checked={isCustomDate}
          onCheckedChange={setIsCustomDate}
          id="custom-date"
        />
        <Label htmlFor="show-details">{"Izaberi datume"}</Label>
      </div>
      {isCustomDate && (
        <RangePicker date={customDate} setDate={setCustomDate} />
      )}
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
      <Button
        disabled={isCustomDate && !customDate}
        onClick={() => handleSearch()}
      >
        PRETRAGA
      </Button>
    </div>
  );
};

export default SearchMenu;