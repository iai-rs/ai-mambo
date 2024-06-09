export interface PatientData {
  patientName: string | undefined;
  patientId: string;
  id: string;
  acquisitionDate: string | null;
  laterality: string | null;
  implant: string | null;
  institution: string | null;
  manufacturer: string | null;
  manufacturerModel: string | null;
  modelResult: number | null | undefined;
  view: number | null | undefined;
}
