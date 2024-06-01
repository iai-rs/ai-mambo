"use client";

import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import SearchMenu from "../SearchMenu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { api } from "~/trpc/react";
import DataTable from "../common/DataTable";
import { format, parse } from "date-fns";
import { type Decimal } from "@prisma/client/runtime/library";
import PatientTable from "./PatientTable";

// interface DicomMetadata {
//   name: string | undefined;
//   jmbg: string;
//   id: string;
//   acquisition_date: string | null;
//   laterality: string | null;
//   implant: string | null;
//   institution: string | null;
//   manufacturer: string | null;
//   manufacturerModel: string | null;
//   modelResult: Decimal | null | undefined;
// }

const Dashboard = () => {
  const [days, setDays] = useState<string>();
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [laterality, setLaterality] = useState("");
  const [implant, setImplant] = useState("");
  const [institution, setInstitution] = useState("");

  const [queryVariables, setQueryVariables] = useState({
    days: 1000,
    patient_id: "",
    patient_name: "",
    // laterality: "",
    // implant: "",
    // institution: "",
  });

  const { data, isLoading, error, refetch } =
    api.metadata.getMetadataDays.useQuery(
      queryVariables,
      {
        staleTime: 0,
      }, // Disable automatic query execution
    );

  const handleSearch = () => {
    setQueryVariables({
      days: Number(days),
      patient_id: patientId,
      patient_name: patientName,
      // laterality,
      // implant,
      // institution,
    });
  };

  return (
    <div className="flex">
      <SearchMenu
        rightContent={
          <div className="overflow-y-auto p-3">
            <PatientTable data={data} isLoading={isLoading} />
          </div>
        }
      >
        <div className="flex flex-col gap-2 p-2">
          <h2 className="mb-4 text-lg">{"PRETRAGA PREGLEDA"}</h2>
          <RadioGroup
            defaultValue="1000"
            value={days}
            onValueChange={(val) => setDays(val)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7" id="r1" />
              <Label htmlFor="r1">7 dana</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30" id="r2" />
              <Label htmlFor="r2">30 dana</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1000" id="r3" />
              <Label htmlFor="r3">3 meseca</Label>
            </div>
          </RadioGroup>
          {/* JMBG */}
          <div className="mt-4">
            <Label>{"Pretraga po JMBG"}</Label>
            <Input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>
          {/* NAME */}
          <div className="mt-4">
            <Label>{"Pretraga po imenu"}</Label>
            <Input
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          <Button onClick={() => handleSearch()}>PRETRAGA</Button>
        </div>
      </SearchMenu>
    </div>
  );
};

export default Dashboard;
