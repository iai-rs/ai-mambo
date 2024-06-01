import type { Table } from "@tanstack/react-table";
import React from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Props<TData> = {
  table: Table<TData>;
  isTableLoading: boolean;
};

/**
 * Renders a UI component for hiding or showing table columns. It provides a dropdown menu
 * where users can toggle the visibility of each column that can be hidden.
 *
 * @param table - The table instance to operate on.
 * @param isTableLoading - Indicates if table data is currently loading.
 * @returns A React element that allows users to toggle column visibility, or null if disabled.
 */
const HidingColumns = <TData,>({ table, isTableLoading }: Props<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isTableLoading}>
        <Button
          variant="outline"
          className="dark:bg-step-table-even-row ml-auto"
        >
          Kolone
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value: unknown) =>
                  column.toggleVisibility(!!value)
                }
              >
                {column.columnDef.meta?.name ?? column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HidingColumns;
