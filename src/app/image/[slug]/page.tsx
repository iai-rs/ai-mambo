import { api } from "~/trpc/server";
import DicomViewer from "./DicomViewer";

const Image = async ({ params: { slug } }: { params: { slug: string } }) => {
  const minio = await api.minio.getMinio(slug);
  return (
    <div>
      {/* HEJ ovo je {minio.url} */}
      <DicomViewer fileUrl={minio.url} />
    </div>
  );
};

export default Image;
