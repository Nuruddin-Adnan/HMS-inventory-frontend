import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import StockTable from "./stockAdjustmentTable";
import { getAllStocks } from "@/api-services/stock/getAllStocks";
import { getAllStockAdjustments } from "@/api-services/stock-adjustment/getAllStockAdjustments";

export default async function StockAdjustment({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";

  const { data: stockAdjusments, meta } = await getAllStockAdjustments(
    `sort=-createdAt&page=${page}&limit=${limit}${query && `&search=${query}`
    }&fields=-createdBy`
  );

  return (
    <div className="card py-4">
      <h2 className="sm:hidden block  pt-0 pb-2 px-4 mb-2 border-b font-bold text-lg">
        Stock Adjusments
      </h2>
      <div className="lg:hidden block pt-2 px-6 pb-4">
        <SearchControl placeholder="Search by name & code..." />
      </div>
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <div className="lg:block hidden">
          <SearchControl placeholder="Search by name..." />
        </div>
        <PaginationControls totalPages={meta.total ?? 0} limit={100} />
      </div>
      <div className="px-4">
        <StockTable stockAdjusments={stockAdjusments} />
      </div>
    </div>
  );
}
