import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import { type PatientData } from "~/types";
import { MyDocument } from "./PDFDocument";
import { Button } from "~/components/ui/button";

type Props = {
  data: PatientData[];
};

const PDFCreatorDetail = ({ data }: Props) => {
  const { patientId, patientName, acquisitionDate } = data[0] ?? {};

  return (
    <PDFDownloadLink
      fileName={`${patientName}-${patientId}-${acquisitionDate}.pdf`}
      document={<MyDocument data={data} />}
    >
      <Button variant="outline">{"Preuzmi .PDF"}</Button>
    </PDFDownloadLink>
  );
};

export default PDFCreatorDetail;
