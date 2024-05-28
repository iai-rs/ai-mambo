import type { Column } from "@tanstack/react-table";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Label } from "~/components/ui/lib/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/lib/popover";
import { RadioGroup, RadioGroupItem } from "~/components/ui/lib/radio-group";
import { cn } from "~/utils/cn";

import type { FavoriteFilterOptions } from "../types";

/**
 * Defines the lookup values for filter options.
 */
const lookupValue: Record<string, FavoriteFilterOptions> = {
  watched: "watched",
  unwatched: "unwatched",
  all: "all",
};

type Props = {
  column: Column<any, unknown>;
};

/**
 * A component that provides a filter UI for marking items as watched, unwatched, or showing all items.
 * Utilizes a popover with radio buttons to select the filter state.
 *
 * @param column - The column object that contains methods for getting and setting filter values.
 * @returns The popover component with radio group for filter selection.
 */
const FavoriteFilter = ({ column }: Props) => {
  const t = useTranslations("table.filterOptions");
  const filterValue = column.getFilterValue() as FavoriteFilterOptions;

  return (
    <Popover>
      <PopoverTrigger className="table__filter-icon">
        <Filter className={cn({ ["stroke-step-light-green"]: !!column.getIsFiltered() })} width={16} height={16} />
      </PopoverTrigger>
      <PopoverContent className="w-fit  dark:bg-step-black">
        <RadioGroup
          className="flex flex-col gap-4"
          defaultValue="comfortable"
          onValueChange={(value: keyof typeof lookupValue) => {
            column.setFilterValue(lookupValue[value]);
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem checked={filterValue === "watched"} value="watched" id="r1" />
            <Label htmlFor="r1">{t("watched")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem checked={filterValue === "unwatched"} value="unwatched" id="r2" />
            <Label htmlFor="r2">{t("unwatched")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem checked={filterValue === "all"} value="all" id="r3" />
            <Label htmlFor="r3">{t("all")}</Label>
          </div>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
};

export default FavoriteFilter;
