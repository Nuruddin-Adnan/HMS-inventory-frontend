import { getAllPurchases } from "@/api-services/purchase/getAllPurchases";
import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import PurchaseTable from "./purchaseTable";

export default async function Purchase({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "3";
  const query = searchParams["query"] ?? "";

  const { data: purchases, meta } = await getAllPurchases(
    `sort=-createdAt&page=${page}&limit=${limit}${query && `&search=${query}`
    }&fields=-createdBy -updatedBy`
  );

  return (
    <div className="card py-4">
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <SearchControl placeholder="Search by name..." />
        <PaginationControls totalPages={meta.total ?? 0} limit={3} />
      </div>
      <div className="px-4">
        <PurchaseTable purchases={purchases} />
      </div>
    </div>
  );
}
