import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import { getAllSuppliers } from "@/api-services/supplier/getAllSuppliers";
import SupplierTable from "./supplierTable";

export default async function Supplier({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";

  const { data: suppliers, meta } = await getAllSuppliers(
    `sort=status -createdAt&page=${page}&limit=${limit}${query && `&search=${query}`
    }&fields=-createdBy -updatedBy&nestedFilter=true`
  );


  return (
    <div className="card py-4">
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <SearchControl placeholder="Search by name & contact..." />
        <PaginationControls totalPages={meta.total} limit={100} />
      </div>
      <div className="px-4">
        <SupplierTable suppliers={suppliers} />
      </div>
    </div>
  );
}
