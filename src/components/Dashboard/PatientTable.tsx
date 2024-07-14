/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";

import { createColumnHelper } from "@tanstack/react-table";

import DataTable from "../common/DataTable";
import { type MetadataResponse } from "~/types";
import Link from "next/link";
import { Button } from "../ui/button";
import { modelResultFormatter } from "../common/Formaters";
import { Badge } from "../ui/badge";
import { parseDateFormat } from "~/utils/parseDateFormat";
import dynamic from "next/dynamic";
// import { PDFCreatorRow } from "../common/PDFCreator/PDFDocument";

const PDFCreatorRow = dynamic(() => import("../common/PDFCreator/Row"), {
  ssr: false,
});

const columnHelper = createColumnHelper<MetadataResponse>();

type Props = {
  data: MetadataResponse[] | undefined;
  isLoading: boolean;
};

const PatientTable = ({ data, isLoading }: Props) => {
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
          header: "Verovatnoća suspektnosti",
          cell: (props) => <Badge variant="outline">{props.getValue()}</Badge>,
        },
      ),
      columnHelper.accessor("acquisitionDate", {
        enableColumnFilter: false,
        header: "Datum pregleda",
        cell: (props) => parseDateFormat(props.getValue() ?? ""),
      }),
      columnHelper.accessor((row) => row.records.length, {
        enableColumnFilter: false,
        header: "Broj snimaka",
        // cell: (props) => BadgeCell(props, "info"),
      }),
      columnHelper.accessor((row) => !!row.records.find((r) => r.feedback), {
        enableColumnFilter: false,
        header: "Analiza radiologa",
        cell: (props) => {
          const value = props.getValue();
          return value ? <Badge variant="secondary">{"DA"}</Badge> : "-";
        },
      }),
      columnHelper.accessor("manufacturer", {
        header: "Proizvođač",
      }),
      columnHelper.accessor("manufacturerModel", {
        header: "Model",
      }),
      columnHelper.accessor("institution", {
        header: "Institucija",
      }),
      columnHelper.accessor(
        (row) => `${row.patientId}-${row.acquisitionDate}`,
        {
          id: "action",
          enableColumnFilter: false,
          enableSorting: false,
          enableHiding: false,
          header: "",
          cell: (props) => {
            const id: string = props.getValue();
            const url = `detail/${id}`;
            // const patientId = props.row.original.patientId;
            // const acquistionDate = props.row.original.acquisitionDate;
            // console.log({ allCells });

            return (
              <div className="flex">
                <Link href={url}>
                  <Button variant="outline">
                    {/* <Search /> */}
                    {"Detalji".toUpperCase()}
                  </Button>
                </Link>
                <PDFCreatorRow
                  acquisitionDate={props.row.original.acquisitionDate ?? ""}
                  patientId={props.row.original.patientId}
                  patientName={props.row.original.patientName ?? ""}
                />
              </div>
            );
          },
        },
      ),
    ],
    [],
  );

  return (
    <div className="min-w-[700px] overflow-y-scroll px-5 py-3">
      <DataTable<MetadataResponse, any>
        defaultSorting={[{ id: "modelResult", desc: true }]}
        columns={columns}
        data={data ?? []}
        enableSorting
        isLoading={isLoading}
        enableColumnsHiding
        enableCSVExport
        leftColumnsPin={["patientName"]}
        rightColumnsPin={["action"]}
      />
    </div>
  );
};

export default PatientTable;
