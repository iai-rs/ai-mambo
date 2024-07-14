import React, { type ReactNode, Suspense } from "react";
import { auth } from "~/auth";
import PatientGallery from "~/components/PatientGallery";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Card, CardContent } from "~/components/ui/card";
import { disclaimerText } from "~/constants/copy";
import { api } from "~/trpc/server";
import { parseDateFormat } from "~/utils/parseDateFormat";
import { getPatientAge } from "~/utils/parseJMBG";

const LeftText = ({ children }: { children: ReactNode }) => (
  <strong className="mr-2 text-muted-foreground">{children}</strong>
);

const DetailPage = async ({ params: { id } }: { params: { id: string } }) => {
  const [patient_id = "", acquisition_date = ""] = id.split("-");
  const data = await api.metadata.getMetadataByDateAndPatientId({
    patient_id,
    acquisition_date,
  });

  const session = await auth();

  if (!data.length || !session?.user) {
    return null;
  }
  const email = session.user?.email ?? "";
  const role = session.user?.role ?? "";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container h-[calc(100vh-86px)] overflow-y-auto pt-2">
        <Breadcrumb className="mt-2 font-bold">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Početna</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Pregled detalja</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-4 mt-2 flex h-fit max-w-[1042px] gap-2">
          <div className="flex flex-col">
            <h2 className="my-4 text-2xl font-bold">{data[0]?.patientName}</h2>
            <div className="grid  gap-2 md:grid-cols-3">
              <Card>
                <CardContent className="mt-4">
                  <div className="flex">
                    <LeftText>{"JMBG:"}</LeftText>
                    <span>{data[0]?.patientId}</span>
                  </div>
                  <div>
                    <LeftText>{"Starost pacijentkinje:"}</LeftText>
                    <span>{getPatientAge(data[0]?.patientId ?? "")}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="mt-4">
                  <div className="flex">
                    <LeftText>{"Datum pregleda:"}</LeftText>
                    {parseDateFormat(data[0]?.acquisitionDate ?? "")}
                  </div>
                  <div className="flex">
                    <LeftText>{"Institucija:"}</LeftText>
                    <span>{data[0]?.institution}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="mt-4">
                  <div className="flex">
                    <LeftText>{"Proizvođač:"}</LeftText>
                    <span>{data[0]?.manufacturer}</span>
                  </div>
                  <div className="flex">
                    <LeftText>{"Model:"}</LeftText>
                    <span>{data[0]?.manufacturerModel}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <PatientGallery email={email} data={data} role={role} />
        <div className="mb-4 max-w-[1000px]">
          <p className="text-sm italic text-muted-foreground">
            {disclaimerText}
          </p>
        </div>
      </div>
    </Suspense>
  );
};

export default DetailPage;
