import Dashboard from "~/components/Dashboard";

import { api } from "~/trpc/server";

export default async function Home() {
  const birads = await api.birads.getBiradsResults();
  if (!birads) return null;
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Dashboard />
      </div>
    </main>
  );
}
