"use client";

import React from "react";

import { Skeleton } from "~/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "~/components/ui/table";

import { generateSequentialNumbers } from "../utils/common";
import { cn } from "~/lib/utils";

type Props = {
  rowsLength: number;
  columnsLength: number;
};

/**
 * Renders skeleton loaders as placeholders for table content, indicating a loading state.
 * This component dynamically generates skeleton placeholders based on the specified
 * number of rows and columns. It can be enabled or disabled as needed.
 *
 * @param rowsLength - The number of rows to generate skeleton loaders for.
 * @param columnsLength - The number of columns in each row for the skeleton loaders.
 * @returns A React fragment containing the skeleton loaders if enabled; otherwise, null.
 */
const SkeletonsLoader = ({ rowsLength, columnsLength }: Props) => (
  <TableBody className="[&_tr]:border-none">
    {generateSequentialNumbers(rowsLength).map((index) => (
      <TableRow
        key={`i-${index}`}
        className={cn("h-[53px] bg-background dark:hover:bg-transparent")}
      >
        {generateSequentialNumbers(columnsLength).map((item) => (
          <TableCell key={item}>
            <Skeleton className="h-4 w-[80%]" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

export default SkeletonsLoader;
