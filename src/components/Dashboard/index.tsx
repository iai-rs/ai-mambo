"use client";

import React, { useEffect, useState } from "react";

import { Button } from "../ui/button";
import SearchMenu from "../SearchMenu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { api } from "~/trpc/react";
import PatientTable from "./PatientTable";

const DEFAULT_DAYS = 7;

const Dashboard = () => {
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [fromBeginningOfYear, setFromBeginningOfYear] =
    useState<boolean>(false);
  const [allData, setAllData] = useState<boolean>(true);
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");

  const [queryVariables, setQueryVariables] = useState({
    days: DEFAULT_DAYS,
    fromBeginningOfYear: false,
    allData: true,
    patient_id: "",
    patient_name: "",
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
      days,
      fromBeginningOfYear,
      allData,
      patient_id: patientId,
      patient_name: patientName,
    });
  };

  useEffect(() => {
    handleSearch();
  }, []);

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
            defaultValue="allData"
            onValueChange={(val) => {
              if (val === "startOfYear") {
                setFromBeginningOfYear(true);
                setAllData(false);
              }
              if (val === "allData") {
                setAllData(true);
                setFromBeginningOfYear(false);
              }
              if (!isNaN(Number(val))) {
                setDays(Number(val));
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="7" id="r1" />
              <Label htmlFor="r1">{"7 dana"}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30" id="r2" />
              <Label htmlFor="r2">{"30 dana"}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="startOfYear" id="r3" />
              <Label htmlFor="r3">{"Od početka godine"}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="allData" id="r4" />
              <Label htmlFor="r4">{"Sve"}</Label>
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
