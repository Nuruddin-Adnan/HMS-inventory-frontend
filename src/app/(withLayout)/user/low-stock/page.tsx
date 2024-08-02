import LowStockTable from "./lowStockTable";
import { getLowStocks } from "@/api-services/stock/getLowStocks";

export default async function LowStock({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "1000";

  const { data: stocks, meta } = await getLowStocks(
    `page=${page}&limit=${limit}&fields=-createdBy -createdAt -updatedBy`
  );

  return (
    <div className="card px-4 pb-2">
      <LowStockTable stocks={stocks} totalPages={meta.total ?? 0} limit={Number(limit)} />
    </div>
  );
}
