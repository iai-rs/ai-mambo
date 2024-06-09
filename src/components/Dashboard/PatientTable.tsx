import { format, parse } from "date-fns";
import React, { useMemo } from "react";
import { Search } from "lucide-react";

import {
  type ColumnDef,
  type CellContext,
  createColumnHelper,
} from "@tanstack/react-table";

import DataTable from "../common/DataTable";
import { Badge } from "../ui/badge";
import { type PatientData } from "types";
import Link from "next/link";
import { Button } from "../ui/button";
import { modelResultFormatter } from "../common/Formaters";

const columnHelper = createColumnHelper<PatientData>();

type Props = {
  data: PatientData[] | undefined;
  isLoading: boolean;
};

const BadgeCell = (
  props: CellContext<PatientData, never>,
  variant: "info" | "default" | "outline",
) => {
  const value: string = props.getValue();
  if (typeof value === "string") {
    return value.trim() ? <Badge variant={variant}>{value}</Badge> : "-";
  }
};

const PatientTable = ({ data, isLoading }: Props) => {
  const columns: ColumnDef<PatientData, never>[] = useMemo(
    () => [
      columnHelper.accessor("patientName", {
        // enableSorting: false,
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
      columnHelper.accessor("implant", {
        enableColumnFilter: false,
        header: "Implant",
        cell: (props) => BadgeCell(props, "info"),
        meta: {
          name: "Implant",
        },
      }),
      columnHelper.accessor("laterality", {
        enableColumnFilter: false,
        header: "Laterality",
        cell: (props) => BadgeCell(props, "outline"),
        meta: {
          name: "Laterality",
        },
      }),
      columnHelper.accessor("view", {
        enableColumnFilter: false,
        header: "Pogled",
        cell: (props) => BadgeCell(props, "outline"),
        meta: {
          name: "Pogled",
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
      columnHelper.accessor("id", {
        enableColumnFilter: false,
        enableSorting: false,
        header: "Akcije",
        cell: (props) => {
          const id: string = props.getValue();
          const url = `detail/${id}`;
          return (
            <Link href={url}>
              <Button variant="ghost">
                <Search />
              </Button>
            </Link>
          );
        },
        meta: {
          name: "Akcije",
        },
      }),
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
        // rightColumnsPin={["id"]}
      />
    </div>
  );
};

export default PatientTable;
