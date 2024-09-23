"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
// import { type DateRangePicker } from "react-day-picker";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { DATE_FORMAT_TOKEN_PICKER } from "~/constants";

export type DateRangePicker = { from: Date; to: Date };

export type RangePickerProps = {
  date: DateRangePicker | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRangePicker | undefined>>;
};

function RangePicker({ date, setDate }: RangePickerProps) {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-auto justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, DATE_FORMAT_TOKEN_PICKER)} -{" "}
                  {format(date.to, DATE_FORMAT_TOKEN_PICKER)}
                </>
              ) : (
                format(date.from, DATE_FORMAT_TOKEN_PICKER)
              )
            ) : (
              <span>Izaberi period</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate as any}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default RangePicker;
