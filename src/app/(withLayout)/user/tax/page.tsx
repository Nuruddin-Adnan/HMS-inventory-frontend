import { getAllTaxs } from "@/api-services/tax/getAllTaxs";
import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import TaxTable from "./taxTable";

export default async function Tax({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";

  const { data: taxs, meta } = await getAllTaxs(
    `sort=status -createdAt&page=${page}&limit=${limit}${
      query && `&search=${query}`
    }&fields=-createdBy -updatedBy`
  );

  return (
    <div className="card py-4">
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <SearchControl placeholder="Search by purpose..." />
        <PaginationControls totalPages={meta.total ?? 0} limit={100} />
      </div>
      <div className="px-4">
        <TaxTable taxs={taxs} />
      </div>
    </div>
  );
}