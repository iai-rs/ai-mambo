import Image from "next/image";
import { api } from "~/trpc/server";

const ImageView = async ({
  params: { slug },
}: {
  params: { slug: string };
}) => {
  const minio = await api.minio.getMinio(slug + ".png");
  return <Image src={minio.url} alt="h" width={512} height={512} />;
};

export default ImageView;
