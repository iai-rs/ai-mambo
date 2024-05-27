"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import SearchMenu from "../SearchMenu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
const Dashboard = () => {
  const [days, setDays] = useState<number>();
  const { data, isLoading, error, refetch } =
    api.metadata.getMetadataDays.useQuery(
      { days },
      { enabled: false }, // Disable automatic query execution
    );

  useEffect(() => {
    if (days) void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  return (
    <div>
      <SearchMenu>
        <div className="flex flex-col gap-2 p-2">
          <h2 className="mb-4 text-lg">{"PRETRAGA PREGLEDA"}</h2>
          <Button variant="secondary">{"Današnji pregledi"}</Button>
          <Button onClick={() => setDays(7)} variant="secondary">
            {"Pregledi za proteklih 7 dana"}
          </Button>
          <Button onClick={() => setDays(400)} variant="secondary">
            {"Pregledi za proteklih 30 dana"}
          </Button>
          <div className="mt-4">
            <Label>{"Pretraga po JMBG"}</Label>
            <Input />
          </div>
        </div>
      </SearchMenu>
      <div className="flex max-w-[500px] flex-col">
        {data?.map((item, index) => {
          return (
            <div key={item.patient_name ?? "" + index}>{item.patient_name}</div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
