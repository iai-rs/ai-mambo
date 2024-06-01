import React from "react";

import { TableBody, TableCell, TableRow } from "~/components/ui/table";

type Props = {
  columnsLength: number;
};

/**
 * Conditionally displays a "NO DATA" message across all columns of a table row if enabled.
 *
 * @param columnsLength - Number of columns to span the message across.
 * @returns A table row indicating no available data if enabled, otherwise null.
 */
const NoData = ({ columnsLength }: Props) => {
  return (
    <TableBody>
      <TableRow
        className="
        bg-step-table-odd-row
        border-step-table-border
        h-[200px]
        border-b
        "
      >
        <TableCell colSpan={columnsLength}>
          <div className="text-step-table-border flex justify-center">
            {"Nema podataka za navedenu pretragu".toUpperCase()}
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export default NoData;
