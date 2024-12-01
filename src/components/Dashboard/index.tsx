"use client";

import React, { useEffect, useState } from "react";

import DashboardLayout from "./layout";
import { api } from "~/trpc/react";
import PatientTable from "./PatientTable";
import SearchMenu from "./SearchMenu";
import { MetadataResponse, PatientData, type SearchType } from "~/types";
import { getDateRange, getCustomDateRange } from "~/utils/getDateRange";
import { type DateRangePicker } from "./SearchMenu/RangePicker";

const Dashboard = () => {
  const [search, setSearch] = useState<SearchType>("7");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [institution, setInstitution] = useState("");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [withoutAnalysis, setWithoutAnalysis] = useState(false);
  const [enableAdvancedRange, setEnableAdvancedRange] = useState(false);
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
    let dateRange = getDateRange("allData");

    if (enableAdvancedRange) {
      dateRange = isCustomDate
        ? getCustomDateRange(customDate)
        : getDateRange(search);
    }

    console.log({ dateRange, enableAdvancedRange });
    setQueryVariables({
      patient_id: patientId,
      patient_name: patientName,
      institution,
      ...dateRange,
    });
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <div className="flex">
      <DashboardLayout
        rightContent={
          <div className="overflow-y-auto p-3">
            <PatientTable
              data={data as unknown as MetadataResponse[]}
              isLoading={isLoading}
            />
          </div>
        }
      >
        <SearchMenu
          value={search}
          customDate={customDate}
          setCustomDate={setCustomDate}
          isCustomDate={isCustomDate}
          setIsCustomDate={setIsCustomDate}
          withoutAnalysis={withoutAnalysis}
          setWithoutAnalysis={setWithoutAnalysis}
          onAdvancedRangeFilterClick={setEnableAdvancedRange}
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
