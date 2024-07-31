import { getAllPurchases } from "@/api-services/purchase/getAllPurchases";
import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import PurchaseTable from "./purchaseTable";
import { getAllSuppliers } from "@/api-services/supplier/getAllSuppliers";
import FilterPurchase from "@/components/FilterPurchase";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function Purchase({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";
  const supplier = searchParams["supplier"] ?? "";
  const paymentStatus = searchParams["paymentStatus"] ?? "";
  const isDue = searchParams["isDue"] ?? "";

  const { data: purchases, meta } = await getAllPurchases(
    `sort=-createdAt&page=${page}&limit=${limit}${query && `&search=${query}`}${supplier && `&supplier=${supplier}`
    }${paymentStatus && `&paymentStatus=${paymentStatus}`}${isDue && `&due[gte]=1`
    }&fields=-createdBy -updatedBy`
  );

  const { data: suppliers } = await getAllSuppliers(
    `status=active&fields=name contactNo brand`
  );

  return (
    <div className="card py-4">
      <h2 className="sm:hidden block  pt-0 pb-2 px-4 mb-2 border-b font-bold text-lg">
        Purchases
      </h2>
      <div className="lg:hidden block pt-2 px-6 pb-4">
        <SearchControl placeholder="Search by name..." />
      </div>
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <div className="lg:block hidden">
          <SearchControl placeholder="By name, lot & invoice..." />
        </div>
        <PaginationControls totalPages={meta.total ?? 0} limit={100} />
        <FilterPurchase suppliers={suppliers} />
      </div>
      <div className="px-4">
        <PurchaseTable purchases={purchases} />
      </div>
    </div>
  );
}
