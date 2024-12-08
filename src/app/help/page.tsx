import HelpContainer from "~/components/Help";

export default async function Help() {
  return (
    <main className="h-[calc(100vh - 100px)] container overflow-auto bg-gray-500">
      <HelpContainer />
    </main>
  );
}
