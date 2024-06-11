import type { Table } from "@tanstack/react-table";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React from "react";
import MSelect from "~/components/common/MSelect";

import { Button } from "~/components/ui/button";

type Props = {
  /** An instance of a Table object from @tanstack/react-table */
  table: Table<never>;
  enable?: boolean;
};

/**
 * Renders a pagination component for a table, allowing users to navigate through pages,
 * adjust the number of rows per page, and jump to the first or last page.
 * This component is only rendered if the `enable` prop is true.
 *
 * @param table - The table instance to control pagination. This should be a table instance created
 *                with a TanStack Table library, containing methods and states related to pagination.
 * @param enable - A boolean flag that determines if the pagination component should be rendered.
 *                 If false, the component will return null.
 * @returns A React element representing the pagination controls if `enable` is true; otherwise, null.
 *
 * The pagination component includes controls for:
 * - Selecting the number of rows to display per page.
 * - Navigating to the previous or next page.
 * - Directly setting a specific page to view.
 * - Jumping to the first or last page of the table.
 * Each control's availability or action is determined by the current state of the table's pagination,
 * such as whether previous or next pages are available.
 */
const Pagination = ({ table, enable }: Props) => {
  const isPreviousPageAvailable = table.getCanPreviousPage();
  const isNextPageAvailable = table.getCanNextPage();

  /** Determines the stroke color for pagination buttons based on their availability.*/
  const resolveStrokeColor = (isAvailable: boolean) =>
    isAvailable ? "#000000" : "#303030";

  if (!enable) return null;

  return (
    <div className="mt-2 flex flex-row-reverse  pt-2">
      <div className="flex flex-wrap items-center gap-6">
        {/* Rows per page */}
        <div className="flex items-center gap-1 font-normal">
          <span>Redova po strani</span>
          <MSelect
            onValueChange={(item) => {
              table.setPageSize(Number(item));
            }}
            selectedItem={table.getState().pagination.pageSize.toString()}
            items={[
              { key: "5", label: "5" },
              { key: "10", label: "10" },
              { key: "20", label: "20" },
              { key: "50", label: "50" },
              { key: "100", label: "100" },
            ]}
          />
        </div>
        {/* Page count */}
        <div>{`Strana ${table.getState().pagination.pageIndex + 1} od ${table.getPageCount()}`}</div>
        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="h-fit rounded border bg-muted p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!isPreviousPageAvailable}
          >
            <ChevronFirst
              stroke={resolveStrokeColor(isPreviousPageAvailable)}
            />
          </Button>
          <Button
            variant="ghost"
            className="h-fit rounded border bg-muted p-1"
            onClick={() => table.previousPage()}
            disabled={!isPreviousPageAvailable}
          >
            <ChevronLeft stroke={resolveStrokeColor(isPreviousPageAvailable)} />
          </Button>
          <Button
            variant="ghost"
            className="h-fit rounded border bg-muted p-1"
            onClick={() => table.nextPage()}
            disabled={!isNextPageAvailable}
          >
            <ChevronRight stroke={resolveStrokeColor(isNextPageAvailable)} />
          </Button>
          <Button
            variant="ghost"
            className="h-fit rounded border bg-muted p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!isNextPageAvailable}
          >
            <ChevronLast stroke={resolveStrokeColor(isNextPageAvailable)} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
