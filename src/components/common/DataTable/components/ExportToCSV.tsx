/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { exportCSV } from "../utils/exportCSV";
import { Button } from "~/components/ui/button";
import { type MetadataResponse } from "~/types";
import { modelResultFormatter } from "../../Formaters";
type Props = {
  data: any[];
  fileName?: string;
};

const parseCSVdata = (data: MetadataResponse[]) => {
  return data.map((d) => {
    return {
      "Ime pacijenta": d.patientName,
      JMBG: d.patientId,
      "Verovatnoća suspektnosti": modelResultFormatter(d.modelResult),
      "Datum pregleda": d.acquisitionDate,
      "Broj snimaka": d.records.length,
      Proizvođač: d.manufacturer,
      "Model proizvođača": d.manufacturerModel,
      Institucija: d.institution,
      "Analiza radiologa": !!d.records.find((r) => r.feedback) ? "DA" : "NE",
    };
  });
};

const ExportToCSV = ({ data, fileName = "Lista pacijenata" }: Props) => {
  return (
    <div className="p-2">
      <Button
        variant="outline"
        onClick={() => exportCSV(parseCSVdata(data), fileName)}
      >
        Preuzmi .CSV
      </Button>
    </div>
  );
};

export default ExportToCSV;
