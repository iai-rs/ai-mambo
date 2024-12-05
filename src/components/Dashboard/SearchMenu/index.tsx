"use client";

import React, { type Dispatch, type SetStateAction } from "react";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { type SearchType } from "~/types";
import RangePicker, { type RangePickerProps } from "./RangePicker";
import { Switch } from "~/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import MSelect from "~/components/common/MSelect";
import { type LimitOption, limitOptions } from "~/constants";
import { Separator } from "~/components/ui/separator";

type Props = {
  patientId: string;
  patientName: string;
  institution: string;
  value: SearchType;
  isCustomDate: boolean;
  setIsCustomDate: Dispatch<SetStateAction<boolean>>;
  withoutAnalysis: boolean;
  setWithoutAnalysis: Dispatch<SetStateAction<boolean>>;
  setPatientId: Dispatch<SetStateAction<string>>;
  setPatientName: Dispatch<SetStateAction<string>>;
  setInstitution: Dispatch<SetStateAction<string>>;
  setSearch: Dispatch<SetStateAction<SearchType>>;
  search: SearchType;
  customDate: RangePickerProps["date"] | undefined;
  setCustomDate: RangePickerProps["setDate"];
  selectedLimitOption: string;
  onSelectLimitOption: (val: LimitOption) => void;
  handleSearch: () => void;
  onAdvancedRangeFilterClick: (param: boolean) => void;
};

const SearchMenu = ({
  customDate,
  setCustomDate,
  handleSearch,
  patientId,
  isCustomDate,
  value,
  withoutAnalysis,
  setWithoutAnalysis,
  setIsCustomDate,
  patientName,
  setPatientName,
  setPatientId,
  institution,
  setInstitution,
  setSearch,
  onSelectLimitOption,
  selectedLimitOption,
  onAdvancedRangeFilterClick,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 p-3">
      {/* Range pick */}
      <h2 className="mb-4 text-lg">{"PRETRAGA PREGLEDA"}</h2>
      <div className="my-4 flex items-center gap-1">
        <Switch
          checked={withoutAnalysis}
          onCheckedChange={setWithoutAnalysis}
          id="without-analysis"
        />
        <Label htmlFor="show-details">{"Bez analize"}</Label>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <Label>{"Limit"}</Label>
        <MSelect
          className="min-w-[100px]"
          selectedItem={selectedLimitOption}
          onValueChange={onSelectLimitOption}
          items={limitOptions.map((l) => ({
            key: l,
            label: l,
          }))}
        />
      </div>
      {/* <Separator className="mb-4 mt-2" /> */}

      <Accordion
        onValueChange={(val) => onAdvancedRangeFilterClick(!!val)}
        type="single"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:no-underline">
            {"Napredna pretraga"}
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              disabled={isCustomDate}
              value={value}
              defaultValue="today"
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
                <Label htmlFor="r2">{"Poslednjih 7 dana"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="r3" />
                <Label htmlFor="r3">{"Poslednjih 30 dana"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="startOfYear" id="r4" />
                <Label htmlFor="r4">{"Od početka godine"}</Label>
              </div>
            </RadioGroup>
            {/* custom date switch */}
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
            {/* INSTITUTION */}
            <div className="mt-4">
              <Label>{"Pretraga po instituciji"}</Label>
              <Input
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        className="mt-2"
        disabled={isCustomDate && !customDate}
        onClick={() => handleSearch()}
      >
        {"PRETRAGA"}
      </Button>
    </div>
  );
};

export default SearchMenu;
