import { ConstructionIcon } from "lucide-react";

export default async function Reports() {
  return (
    <main>
      <div className="mt-10 flex justify-center">
        <div className="flex gap-3">
          <ConstructionIcon className="text-red-400" />
          {"STRANICA U IZRADI"}
        </div>
      </div>
    </main>
  );
}
