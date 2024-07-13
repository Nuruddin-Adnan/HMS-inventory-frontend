import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import { getAllOrders } from "@/api-services/order/getAllOrders";
import OrderTable from "./orderTable";
import FilterOrder from "@/components/FilterOrder";

export default async function Order({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "5";
  const query = searchParams["query"] ?? "";
  const paymentStatus = searchParams["paymentStatus"] ?? "";
  const isDue = searchParams["isDue"] ?? "";

  const { data: orders, meta } = await getAllOrders(
    `sort=-createdAt&page=${page}&limit=${limit}${query && `&search=${query}`}${paymentStatus && `&paymentStatus=${paymentStatus}`}${isDue && `&due[gte]=1`
    }&fields=-createdBy -updatedBy`
  );

  return (
    <div className="card py-4">
      <div className="lg:hidden block pt-2 px-6 pb-4">
        <SearchControl placeholder="Search by name..." />
      </div>
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <div className="lg:block hidden">
          <SearchControl placeholder="By invoice no..." />
        </div>
        <PaginationControls totalPages={meta.total ?? 0} limit={5} />
        <FilterOrder />
      </div>
      <div className="px-4">
        <OrderTable orders={orders} />
      </div>
    </div>
  );
}
