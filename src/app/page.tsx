import Link from "next/link";

import { api } from "~/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const birads = await api.birads.getBiradsResults();
  console.log(birads);
  if (!birads) return null;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Mambo <span className="text-[hsl(280,100%,70%)]">AI</span>
        </h1>
        <div className="flex flex-col gap-3">
          {birads.map(({ model_1_result, study_uid }) => {
            return (
              <div className="flex flex-col" key={study_uid}>
                <span>Study UID: {study_uid}</span>
                <span>Model 1 Results: {model_1_result}</span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
