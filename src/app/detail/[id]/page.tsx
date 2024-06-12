import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { auth } from "~/auth";
import PatientGallery from "~/components/PatientGallery";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/server";

const DetailPage = async ({ params: { id } }: { params: { id: string } }) => {
  // const [data, image] = await Promise.all([
  //   api.metadata.getMetadataById({ mammography_id: id }),
  //   api.minio.getMinio(id + ".png"),
  // ]);
  // const data = await api.metadata.getMetadataById({ mammography_id: id });
  const [patient_id = "", acquisition_date = ""] = id.split("-");
  const data = await api.metadata.getMetadataByDateAndPatientId({
    patient_id,
    acquisition_date,
  });

  const session = await auth();

  if (!data.length || !session?.user) {
    return null;
  }
  const name = session.user?.name ?? "";
  const email = session.user?.email ?? "";
  console.log("email", email);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container h-[calc(100vh-86px)] overflow-y-auto pt-2">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft />
          </Button>
        </Link>
        <div className="mb-4 mt-2 flex h-fit gap-2">
          <Card>
            <CardHeader>
              <CardTitle>{data[0]?.patientName}</CardTitle>
              <CardDescription>{data[0]?.acquisitionDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex">JMBG: {data[0]?.patientId}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="mt-4">
              <div className="flex">Institucija: {data[0]?.institution}</div>
              <div className="flex">Proizvođač: {data[0]?.manufacturer}</div>
              <div className="flex">Model: {data[0]?.manufacturerModel}</div>
            </CardContent>
          </Card>
        </div>
        <PatientGallery email={email} data={data} />
      </div>
    </Suspense>
  );
};

export default DetailPage;
