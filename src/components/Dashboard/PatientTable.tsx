import { format, parse } from "date-fns";
import React, { useMemo } from "react";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

import DataTable from "../common/DataTable";
import { type MetadataResponse } from "~/types";
import Link from "next/link";
import { Button } from "../ui/button";
import { modelResultFormatter } from "../common/Formaters";
import { Badge } from "../ui/badge";

const columnHelper = createColumnHelper<MetadataResponse>();

type Props = {
  data: MetadataResponse[] | undefined;
  isLoading: boolean;
};

const PatientTable = ({ data, isLoading }: Props) => {
  const columns: ColumnDef<MetadataResponse, never>[] = useMemo(
    () => [
      columnHelper.accessor("patientName", {
        enableColumnFilter: true,
        header: "Ime",
        meta: {
          name: "Ime",
        },
      }),
      columnHelper.accessor("patientId", {
        enableColumnFilter: false,
        header: "JMBG",
        meta: {
          name: "JMBG",
        },
      }),
      columnHelper.accessor(
        ({ modelResult }) => modelResultFormatter(modelResult),
        {
          id: "modelResult",
          enableColumnFilter: false,
          header: "Verovatnoća suspektnosti",
          cell: (props) => <Badge variant="outline">{props.getValue()}</Badge>,
          meta: {
            name: "Verovatnoća suspektnosti",
          },
        },
      ),
      columnHelper.accessor("acquisitionDate", {
        enableColumnFilter: false,
        header: "Datum pregleda",
        cell: (props) => {
          const parsedDate = parse(props.getValue(), "yyyyMMdd", new Date());
          if (isNaN(parsedDate.getTime())) return "-";
          // Format the Date object to a human-readable string

          const formattedDate = format(parsedDate, "dd/MM/yyyy");
          return formattedDate;
        },
        meta: {
          name: "Datum pregleda",
        },
      }),
      columnHelper.accessor((row) => row.records.length, {
        enableColumnFilter: false,
        header: "Broj snimaka",
        // cell: (props) => BadgeCell(props, "info"),
        meta: {
          name: "Broj snimaka",
        },
      }),
      columnHelper.accessor("manufacturer", {
        enableColumnFilter: false,
        header: "Proizvođač",
        meta: {
          name: "Proizvođač",
        },
      }),
      columnHelper.accessor("manufacturerModel", {
        enableColumnFilter: false,
        header: "Model",
        meta: {
          name: "Model",
        },
      }),
      columnHelper.accessor("institution", {
        header: "Institucija",
        meta: {
          name: "Institucija",
        },
      }),
      columnHelper.accessor(
        (row) => `${row.patientId}-${row.acquisitionDate}`,
        {
          id: "action",
          enableColumnFilter: false,
          enableSorting: false,
          header: "",
          cell: (props) => {
            const id: string = props.getValue();
            const url = `detail/${id}`;
            return (
              <Link href={url}>
                <Button variant="outline">
                  {/* <Search /> */}
                  {"Detalji".toUpperCase()}
                </Button>
              </Link>
            );
          },
          meta: {
            name: "Akcije",
          },
        },
      ),
    ],
    [],
  );
  return (
    <div className="min-w-[700px] overflow-y-scroll px-5 py-3">
      <DataTable
        defaultSorting={[{ id: "modelResult", desc: true }]}
        columns={columns}
        data={data ?? []}
        enableSorting
        isLoading={isLoading}
        enableColumnsHiding
        leftColumnsPin={["patientName"]}
        rightColumnsPin={["action"]}
      />
    </div>
  );
};

export default PatientTable;
