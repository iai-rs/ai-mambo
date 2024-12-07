"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { api } from "~/trpc/react";
import DataTable from "../common/DataTable";
import type { UsersWithResults } from "~/server/api/root";
import { Badge } from "../ui/badge";

const columnHelper = createColumnHelper<UsersWithResults[0]>();

const Reports = () => {
  const { data, isLoading } = api.feedback.getAllUsersWithResults.useQuery();
  const filteredData = useMemo(
    () => data?.filter((item) => item.feedback.length),
    [data],
  );

  const columns: ColumnDef<UsersWithResults[0]>[] = useMemo(
    () => [
      columnHelper.accessor("email", {
        header: "Email",
      }),
      columnHelper.accessor("name", {
        header: "Ime",
      }),
      columnHelper.accessor("role", {
        header: "Rola",
        cell: (props) => <Badge variant="outline">{props.getValue()}</Badge>,
      }),
      columnHelper.accessor((row) => row.feedback.length, {
        id: "feedback",
        enableColumnFilter: false,
        header: "Broj analiza",
        cell: (props) => (
          <Badge variant="destructive">{props.getValue()}</Badge>
        ),
      }),
      columnHelper.accessor((row) => row.feedback.length, {
        id: "date",
        header: "Poslednji upis",
        enableColumnFilter: false,
        cell: ({
          row: {
            original: { feedback },
          },
        }) => {
          if (feedback.length) {
            return feedback[feedback.length - 1]?.createdAt.toLocaleString();
          }
        },
      }),
    ],
    [],
  );

  return (
    <div className="min-w-[700px] overflow-y-scroll px-5 py-3">
      <h1 className="mb-4 text-2xl font-bold">
        {"Broj urađenih analiza pacijenata po korisniku"}
      </h1>
      <DataTable<UsersWithResults[0], any>
        columns={columns}
        data={(filteredData as any) ?? []} // TODO: check as any later
        enableSorting
        isLoading={isLoading}
        defaultSorting={[{ id: "feedback", desc: true }]}
        enableCSVExport
      />
    </div>
  );
};

export default Reports;
