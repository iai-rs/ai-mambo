/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { exportCSV } from "../utils/exportCSV";
import { Button } from "~/components/ui/button";
type Props = {
  data: any[];
  fileName?: string;
};

const ExportToCSV = ({ data, fileName = "Step Table" }: Props) => {
  return (
    <div className="p-2">
      <Button variant="outline" onClick={() => exportCSV(data, fileName)}>
        Preuzmi .CSV
      </Button>
    </div>
  );
};

export default ExportToCSV;
