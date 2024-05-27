import Link from "next/link";
import { signOut } from "../auth";
import Dashboard from "~/components/Dashboard";

import { api } from "~/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const birads = await api.birads.getBiradsResults();
  const users = await api.users.getUsers();
  // const birads = await api.metadata.getMetadata();
  if (!birads) return null;
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button>
            <div>Sign Out (CLICK ME!!!)</div>
          </button>
        </form>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Mambo <span className="text-[hsl(280,100%,70%)]">AI</span>
        </h1>
        <div>Users: {JSON.stringify(users)}</div>
      </div>
    </main>
  );
}
