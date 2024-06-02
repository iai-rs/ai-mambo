import type { Column } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { X } from "lucide-react";
import type { MouseEventHandler } from "react";
import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { DebouncedInput } from "../../DebouncedInput";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

type Props = { column: Column<any, unknown> };

/**
 * Renders a filter UI with minimum and maximum input fields for a table column.
 *
 * @param column The table column object.
 * @returns A min max filter UI or null if disabled.
 */
const MinMaxFilter = ({ column }: Props) => {
  const columnFilterValue = column.getFilterValue() ?? "";

  return (
    <Popover>
      <PopoverTrigger
        onClick={(e: MouseEvent) => e.stopPropagation()}
        className="table__filter-icon"
      >
        <Filter
          className={cn({ ["stroke-green-400"]: !!column.getIsFiltered() })}
          width={16}
          height={16}
        />
      </PopoverTrigger>
      <PopoverContent className=" dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <FilterInput
            autoFocus
            placeholder={"MIN"}
            value={(columnFilterValue as [number, number])?.[0] ?? ""}
            onClear={(e) => {
              e.stopPropagation();
              column.setFilterValue((prev: [number, number]) => [
                "",
                prev?.[1],
              ]);
            }}
            onChange={(value) =>
              column.setFilterValue((prev: [number, number]) => [
                value,
                prev?.[1],
              ])
            }
          />
          <FilterInput
            placeholder={"MAX"}
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onClear={(e: Event) => {
              e.stopPropagation();
              column.setFilterValue((prev: [number, number]) => [
                prev?.[0],
                "",
              ]);
            }}
            onChange={(value) =>
              column.setFilterValue((prev: [number, number]) => [
                prev?.[0],
                value,
              ])
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

type FilterInputProps = {
  autoFocus?: boolean;
  placeholder: string;
  value: string | number;
  onChange: (value: string | number) => void;
  onClear: MouseEventHandler<HTMLButtonElement>;
};

/**
 * A sub-component for rendering a debounced input field with a clear button.
 */
const FilterInput = ({
  autoFocus = false,
  placeholder,
  value,
  onChange,
  onClear,
}: FilterInputProps) => (
  <div className="flex items-center gap-3">
    <DebouncedInput
      autoFocus={autoFocus}
      className="h-8 dark:bg-slate-700"
      placeholder={placeholder}
      value={value as string}
      onChange={onChange}
    />
    <Button className="h-8 p-1" variant="ghost" onClick={onClear}>
      <X width={16} height={16} />
    </Button>
  </div>
);

export default MinMaxFilter;
