"use client";

import React, { useEffect, useState } from "react";

import DashboardLayout from "./layout";
import { api } from "~/trpc/react";
import PatientTable from "./PatientTable";
import SearchMenu from "./SearchMenu";

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
      <DashboardLayout
        rightContent={
          <div className="overflow-y-auto p-3">
            <PatientTable data={data} isLoading={isLoading} />
          </div>
        }
      >
        <SearchMenu
          handleSearch={handleSearch}
          patientId={patientId}
          patientName={patientName}
          setAllData={setAllData}
          setDays={setDays}
          setFromBeginningOfYear={setFromBeginningOfYear}
          setPatientId={setPatientId}
          setPatientName={setPatientName}
        />
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
