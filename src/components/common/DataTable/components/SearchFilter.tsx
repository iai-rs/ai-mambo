/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Column } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import React, { type MouseEvent } from "react";

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
        onClick={(e: MouseEvent) => e.stopPropagation()}
        className="
          rounded-md
          p-1.5
          focus:outline-transparent
          dark:border-neutral-800
          "
      >
        <Search
          className={cn({
            ["stroke-blue-500"]: !!column.getIsFiltered(),
          })}
          width={16}
          height={16}
        />
      </PopoverTrigger>
      <PopoverContent
        className=" dark:bg-slate-700"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <DebouncedInput
            autoFocus
            className="h-8 dark:bg-slate-700"
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
