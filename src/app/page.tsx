import { signOut } from "../auth";
import Dashboard from "~/components/Dashboard";

import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const birads = await api.birads.getBiradsResults();
  // const users = await api.users.getUsers();
  // const birads = await api.metadata.getMetadata();
  if (!birads) return null;
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {/* <div className="h-8 bg-red-500">OVDE</div> */}
        <div className="h-[50px] bg-blue-500">
          <form
            action={async () => {
              "use server";
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              await signOut();
            }}
          >
            <Button>Sign Out (CLICK ME!!!)</Button>
          </form>
        </div>
        <Dashboard />
      </div>
    </main>
  );
}
