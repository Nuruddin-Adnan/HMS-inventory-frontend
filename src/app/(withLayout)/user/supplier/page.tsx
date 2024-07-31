import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import { getAllSuppliers } from "@/api-services/supplier/getAllSuppliers";
import SupplierTable from "./supplierTable";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function Supplier({
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

  const { data: suppliers, meta } = await getAllSuppliers(
    `sort=status -createdAt&page=${page}&limit=${limit}${query && `&search=${query}`
    }&fields=-createdBy -updatedBy&nestedFilter=true`
  );


  return (
    <div className="card py-4">
      <h2 className="sm:hidden block  pt-0 pb-2 px-4 mb-2 border-b font-bold text-lg">
        Supplier
      </h2>
      <div className="lg:hidden block pt-2 px-6 pb-4">
        <SearchControl placeholder="Search by name & contact..." />
      </div>
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <div className="lg:block hidden">
          <SearchControl placeholder="Search by name & contact..." />
        </div>
        <PaginationControls totalPages={meta.total ?? 0} limit={100} />
      </div>
      <div className="px-4">
        <SupplierTable suppliers={suppliers} />
      </div>
    </div>
  );
}
