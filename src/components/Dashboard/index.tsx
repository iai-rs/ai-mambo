"use client";

import React, { useEffect, useState } from "react";

import DashboardLayout from "./layout";
import { api } from "~/trpc/react";
import PatientTable from "./PatientTable";
import SearchMenu from "./SearchMenu";
import { type SearchType } from "~/types";
import getDateRange from "~/utils/getDateRange";

const Dashboard = () => {
  const [search, setSearch] = useState<SearchType>("allData");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");

  const [queryVariables, setQueryVariables] = useState<{
    patient_id: string;
    patient_name: string;
    gte: string | undefined;
    lte: string;
  }>({
    patient_id: "",
    patient_name: "",
    gte: undefined,
    lte: "",
  });

  const { data, isLoading, error, refetch } =
    api.metadata.getMetadataByRange.useQuery(
      queryVariables,
      {
        staleTime: 0,
      }, // Disable automatic query execution
    );

  const handleSearch = () => {
    setQueryVariables({
      patient_id: patientId,
      patient_name: patientName,
      ...getDateRange(search),
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
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
          patientId={patientId}
          patientName={patientName}
          setPatientId={setPatientId}
          setPatientName={setPatientName}
        />
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
