import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import type { FavoriteFilterOptions } from "../types";

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultSorting?: SortingState;
  defaultFilters?: ColumnFiltersState;
  pageSize?: number;
};

const useStepTable = <TData, TValue>({
  columns,
  data,
  defaultFilters,
  defaultSorting,
  pageSize = 10,
}: Props<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting ?? []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(defaultFilters ?? []);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
    filterFns: {
      favoriteFilter: (row, columnId, filterValue: FavoriteFilterOptions) => {
        const isFavorite = row.original?.isFavorite;

        // If filterValue is "all", always return true.
        // Otherwise, return true if filterValue aligns with the isFavorite status.
        return (
          filterValue === "all" ||
          (filterValue === "watched" && isFavorite) ||
          (filterValue === "unwatched" && !isFavorite)
        );
      },
      checkboxFilter: (row, columnId, filterValue: string[]) => {
        // Access the original value for the specified column
        const item = row.original[columnId];
        // Check if the item is present in the filter value array
        return filterValue.includes(item);
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    defaultColumn: {
      size: 200, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
  });

  return { table };
};

export { useStepTable };
