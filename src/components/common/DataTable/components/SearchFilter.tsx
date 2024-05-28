/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Column } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { DebouncedInput } from "../../DebouncedInput";

type Props = { column: Column<any, unknown> };

/**
 * Renders a debounced search input as a popover for filtering table columns.
 *
 * @param column The column information and filter logic.
 * @returns A search filter UI or null if disabled.
 */
const SearchFilter = ({ column }: Props) => {
  const columnFilterValue = column.getFilterValue() ?? "";
  return (
    <Popover>
      <PopoverTrigger
        onClick={(e: Event) => e.stopPropagation()}
        className="
          hover:bg-step-table-border
          rounded-md
          p-1.5
          focus:outline-transparent
          dark:border-neutral-800
          "
      >
        <Search
          className={cn({
            ["stroke-step-light-green"]: !!column.getIsFiltered(),
          })}
          width={16}
          height={16}
        />
      </PopoverTrigger>
      <PopoverContent
        className=" dark:bg-step-black"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        onClick={(e: Event) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <DebouncedInput
            autoFocus
            className="dark:bg-step-black h-8"
            placeholder={"pretraga"}
            value={columnFilterValue as string}
            onChange={(value) => column.setFilterValue(value)}
          />
          <Button
            disabled={!columnFilterValue}
            className="h-8"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              column.setFilterValue("");
            }}
          >
            <X width={16} height={16} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchFilter;
