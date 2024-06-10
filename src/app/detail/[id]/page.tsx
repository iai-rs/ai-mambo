import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import ImageWithDetails from "~/components/ImageWithDetails";
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
  const [data, image] = await Promise.all([
    api.metadata.getMetadataById({ mammography_id: id }),
    api.minio.getMinio(id + ".png"),
  ]);

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
              <CardTitle>{data.patientName}</CardTitle>
              <CardDescription>{data.acquisitionDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex">JMBG: {data.patientId}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="mt-4">
              <div className="flex">Institucija: {data.institution}</div>
              <div className="flex">Proizvođač: {data.manufacturer}</div>
              <div className="flex">Model: {data.manufacturerModel}</div>
            </CardContent>
          </Card>
        </div>
        <ImageWithDetails data={data} url={image.url} />
      </div>
    </Suspense>
  );
};

export default DetailPage;
