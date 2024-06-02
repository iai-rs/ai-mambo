import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { modelResultFormatter } from "~/components/common/Formaters";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
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
              <div className="mb-2 flex">
                <span className="mr-1">Resultat:</span>
                <Badge>
                  {modelResultFormatter(data.modelResult as unknown as number)}
                </Badge>
              </div>
              <div className="flex">JMBG: {data.patientId}</div>
              <div className="flex">ID: {data.id}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="mt-4">
              <div className="flex">Institucija: {data.institution}</div>
              <div className="flex">Proizvođač: {data.manufacturer}</div>
              <div className="flex">Model: {data.manufacturerModel}</div>
              <div className="my-2">
                <Separator />
              </div>
              <div className="flex">Implant: {data.implant}</div>
              <div className="flex">Pogled: {data.view}</div>
              <div className="flex">Laterality: {data.laterality}</div>
            </CardContent>
          </Card>
        </div>
        <Image width={500} height={500} src={image.url} alt="img" />
      </div>
    </Suspense>
  );
};

export default DetailPage;
