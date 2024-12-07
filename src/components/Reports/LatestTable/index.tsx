"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import DataTable from "~/components/common/DataTable";
import { modelResultFormatter } from "~/components/common/Formaters";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import type { MetadataResponse } from "~/types";
import { parseDateFormat } from "~/utils/parseDateFormat";

const columnHelper = createColumnHelper<MetadataResponse>();

const LatestTable = () => {
  const { data, isLoading } = api.metadata.getMetadataByRange.useQuery(
    { limit: 100 },
    {
      staleTime: 0,
    }, // Disable automatic query execution
  );
  const columns = useMemo(
    () => [
      columnHelper.accessor("patientName", {
        enableColumnFilter: true,
        enableHiding: false,
        header: "Ime",
      }),
      columnHelper.accessor("patientId", {
        enableColumnFilter: false,
        enableSorting: false,
        header: "JMBG",
      }),
      columnHelper.accessor(
        ({ modelResult }) => modelResultFormatter(modelResult),
        {
          id: "modelResult",
          enableColumnFilter: false,
          enableSorting: true,
          header: "Verovatnoća suspektnosti",
          cell: (props) => <Badge variant="outline">{props.getValue()}</Badge>,
        },
      ),
      columnHelper.accessor("acquisitionDate", {
        enableColumnFilter: false,
        header: "Datum pregleda",
        cell: (props) => parseDateFormat(props.getValue() ?? ""),
      }),
    ],
    [],
  );

  return (
    <DataTable<MetadataResponse, any>
      defaultSorting={[{ id: "modelResult", desc: true }]}
      columns={columns}
      data={(data as any) ?? []}
      enableSorting
      isLoading={isLoading}
      pageSize={10}
    />
  );
};

export default LatestTable;
