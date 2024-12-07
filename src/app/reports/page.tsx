import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import ReportsContainer from "~/components/Reports";

export default async function Reports() {
  return (
    <main className="container mt-4 flex flex-col gap-4">
      <Breadcrumb className="mt-2 font-bold">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{"Početna"}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{"Izveštaji"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-2 flex justify-center">
        <ReportsContainer />
      </div>
    </main>
  );
}
