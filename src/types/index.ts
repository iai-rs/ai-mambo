import { type BiradsFeedback } from "@prisma/client";

export interface SharedMetadataProps {
  patientName: string | undefined;
  patientId: string;
  modelResult: number | null | undefined;
  acquisitionDate: string | null;
  institution: string | null;
  manufacturer: string | null;
  manufacturerModel: string | null;
}

export interface PatientData extends SharedMetadataProps {
  id?: string;
  laterality?: string | null;
  implant?: string | null;
  modelResult: number | null | undefined;
  view: string | null | undefined;
  feedback: BiradsFeedback | null | undefined;
}

export interface MetadataResponse extends SharedMetadataProps {
  records: PatientData[];
}

export type SearchType = "allData" | "startOfYear" | "today" | "7" | "30";
