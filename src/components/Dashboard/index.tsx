"use client";

import React, { useEffect, useState } from "react";

import DashboardLayout from "./layout";
import { api } from "~/trpc/react";
import PatientTable from "./PatientTable";
import SearchMenu from "./SearchMenu";
import { type SearchType } from "~/types";
import { getDateRange, getCustomDateRange } from "~/utils/getDateRange";
import { type DateRangePicker } from "./SearchMenu/RangePicker";

const Dashboard = () => {
  const [search, setSearch] = useState<SearchType>("allData");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [institution, setInstitution] = useState("");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState<DateRangePicker | undefined>();

  const [queryVariables, setQueryVariables] = useState<{
    patient_id: string;
    patient_name: string;
    institution: string;
    gte: string | undefined;
    lte: string;
  }>({
    patient_id: "",
    patient_name: "",
    institution: "",
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
      institution,
      ...(!isCustomDate
        ? getDateRange(search)
        : getCustomDateRange(customDate)),
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
          customDate={customDate}
          setCustomDate={setCustomDate}
          isCustomDate={isCustomDate}
          setIsCustomDate={setIsCustomDate}
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
          patientId={patientId}
          patientName={patientName}
          setPatientId={setPatientId}
          setPatientName={setPatientName}
          institution={institution}
          setInstitution={setInstitution}
        />
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
