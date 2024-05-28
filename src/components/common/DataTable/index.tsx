/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  ColumnDef,
  ColumnFilter,
  SortingState,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import HeaderContentWrapper from "./components/HeaderContentWrapper";
import HidingColumns from "./components/HidingColumns";
import NoData from "./components/NoData";
import Pagination from "./components/Pagination";
import ResizeBorder from "./components/ResizeBorder";
import SearchFilter from "./components/SearchFilter";
import SkeletonsLoader from "./components/SkeletonsLoader";
import SortingIndicators from "./components/SortingIndicators";
import { useStepTable } from "./hooks/useStepTable";
import { resolveRowBackground } from "./utils/common";
import { cn } from "~/lib/utils";

const DEFAULT_PAGE_SIZE = 10;

export type TableProps<TData, TValue> = {
  title?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // favoriteId?: (typeof FAVORITES)[keyof typeof FAVORITES];
  enableColumnResizing?: boolean;
  enablePagination?: boolean;
  enableFavoriteFilter?: boolean;
  enableColumnsHiding?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  isLoading?: boolean;
  pageSize?: number;
  defaultFilters?: ColumnFilter[];
  defaultSorting?: SortingState;
};

const DataTable = <TData, TValue>({
  title = "",
  data = [],
  columns,
  enableColumnResizing = false,
  enablePagination = true,
  enableColumnsHiding = false,
  enableFavoriteFilter = true,
  enableSorting = true,
  enableFiltering = true,
  isLoading = false,
  pageSize = DEFAULT_PAGE_SIZE,
  defaultFilters,
  defaultSorting,
}: TableProps<TData, TValue>) => {
  const { table } = useStepTable({
    columns,
    data,
    defaultFilters,
    defaultSorting,
    pageSize,
  });
  const tableRows = table.getRowModel().rows;
  const leafColumnsNum = table.getAllLeafColumns().length;

  const isDataAvailable = tableRows.length > 0;

  return (
    <div className="mb-3 flex flex-col gap-3 p-2 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Table title */}
        <span className="text-sm font-semibold">{title}</span>
        <div className="flex gap-2">
          {/* Hiding columns */}
          {enableColumnsHiding && (
            <HidingColumns<TData> table={table} isTableLoading={isLoading} />
          )}
          {/* CSV export */}
        </div>
      </div>
      <Table>
        {/* HEADER */}
        <TableHeader
        // className="bg-[#a8a8a8]"
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="p-3 dark:hover:bg-transparent [&_th:first-child]:rounded-tl-md [&_th:last-child]:rounded-tr-md"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header, index) => {
                const isLastItem = headerGroup.headers.length - 1 === index;
                const isSortable = header.column.getCanSort() && enableSorting;
                const isFilterable =
                  header.column.getCanFilter() && enableFiltering;
                const headerCustomStyle =
                  header.column.columnDef.meta?.header?.customStyle ?? {};

                return (
                  <TableHead
                    colSpan={header.colSpan}
                    style={headerCustomStyle}
                    className={cn({
                      "hover:bg-step-table-hover relative whitespace-nowrap text-right":
                        isSortable && !isLoading,
                    })}
                    key={header.id}
                  >
                    {/* Header content */}
                    <HeaderContentWrapper
                      isLastItem={isLastItem}
                      isLoading={isLoading}
                      isSortable={isSortable}
                      align={header.column.columnDef.meta?.align}
                      isPlaceholder={header.isPlaceholder}
                      onClick={
                        enableSorting
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      header={flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      features={
                        <div className="relative flex items-center gap-1">
                          {/* Search filter */}
                          {isFilterable && !isLoading && (
                            <SearchFilter column={header.column} />
                          )}
                          {/* Sorting indicators */}
                          {isSortable && !isLoading && (
                            <SortingIndicators
                              sort={header.column.getIsSorted()}
                            />
                          )}
                        </div>
                      }
                    />
                    {/* Resizing */}
                    {enableColumnResizing && header.column.getCanResize() && (
                      <ResizeBorder
                        isResizing={header.column.getIsResizing()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        {/* LOADER */}
        {isLoading && (
          <SkeletonsLoader
            rowsLength={table.getState().pagination.pageSize}
            columnsLength={leafColumnsNum}
          />
        )}
        {/* DATA */}
        {!isLoading && isDataAvailable && (
          <TableBody>
            {tableRows.map((row, index) => {
              const isLastRow = tableRows.length - 1 === index;
              return (
                <TableRow
                  className={cn(
                    { ["[&_td:first-child]:rounded-bl-md"]: isLastRow },
                    { ["[&_td:last-child]:rounded-br-md"]: isLastRow },
                    resolveRowBackground(index),
                  )}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      align={cell.column.columnDef.meta?.align}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        )}
        {/* NO DATA */}
        {!isLoading && !isDataAvailable && (
          <NoData columnsLength={leafColumnsNum} />
        )}
      </Table>
      <Pagination
        enable={enablePagination && !isLoading}
        table={table as never}
      />
    </div>
  );
};

export default DataTable;
