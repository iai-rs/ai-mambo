import Dashboard from "~/components/Dashboard";

import { api } from "~/trpc/server";

export default async function Home() {
  const birads = await api.birads.getBiradsResults();
  if (!birads) return null;
  return (
    <main>
      <Dashboard />
    </main>
  );
}
