import React from "react";

import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { FileDown } from "lucide-react";

import { type PatientData } from "~/types";
import { MyDocument } from "./PDFDocument";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

type Props = {
  patientId: string;
  acquisitionDate: string;
  patientName: string;
};

const PDFCreatorRow = ({ patientId, acquisitionDate, patientName }: Props) => {
  const { refetch } = api.metadata.getMetadataByDateAndPatientId.useQuery(
    {
      acquisition_date: acquisitionDate,
      patient_id: patientId,
    },
    {
      enabled: false,
    },
  );

  const generatePdfDocument = async (data: PatientData[]) => {
    const blob = await pdf(<MyDocument data={data} />).toBlob();
    saveAs(blob, `${patientName}-${patientId}-${acquisitionDate}.pdf`);
  };

  const handleDownload = async () => {
    const { data } = await refetch();

    if (data) {
      void generatePdfDocument(data);
    }
  };

  return (
    <Button variant="ghost" onClick={handleDownload}>
      <FileDown />
    </Button>
  );
};

export default PDFCreatorRow;
