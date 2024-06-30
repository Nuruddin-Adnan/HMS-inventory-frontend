import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import StockTable from "./stockTable";
import { getAllStocks } from "@/api-services/stock/getAllStocks";

export default async function stock({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";

  const { data: stocks, meta } = await getAllStocks(
    `sort=status -createdAt&page=${page}&limit=${limit}${
      query && `&search=${query}`
    }&fields=-createdBy -updatedBy`
  );

  return (
    <div className="card py-4">
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <SearchControl placeholder="Search by name..." />
        <PaginationControls totalPages={meta.total} limit={100} />
      </div>
      <div className="px-4">
        <StockTable stocks={stocks} />
      </div>
    </div>
  );
}
