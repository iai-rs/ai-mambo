import { type BiradsFeedback, type DicomMetadata } from "@prisma/client";
import { type Decimal } from "@prisma/client/runtime/library";
import { type PatientData } from "~/types";

type MetadataProp = DicomMetadata & {
  biradsResults?: {
    model_1_result?: Decimal | null | undefined;
    feedback: BiradsFeedback | null;
  };
};

export function parseMetadata(metadata: MetadataProp): PatientData {
  return {
    patientName: metadata.patient_name?.replace("^", " "),
    patientId: metadata.patient_id,
    id: metadata.mammography_id,
    acquisitionDate: metadata.acquisition_date,
    laterality: metadata.laterality,
    implant: metadata.implant,
    institution: metadata.institution,
    manufacturer: metadata.manufacturer,
    manufacturerModel: metadata.manufacturer_model,
    modelResult: metadata.biradsResults?.model_1_result
      ? Number(metadata.biradsResults.model_1_result)
      : 0,
    view: metadata.view,
    feedback: metadata.biradsResults?.feedback,
  };
}
