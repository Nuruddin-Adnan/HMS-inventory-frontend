import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import CustomerTable from "./customerTable";
import { getAllCustomers } from "@/api-services/customer/getAllCustomers";

export default async function Customer({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";

  const { data: customers, meta } = await getAllCustomers(
    `sort=status -createdAt&page=${page}&limit=${limit}${
      query && `&search=${query}`
    }&fields=-createdBy -updatedBy`
  );

  return (
    <div className="card py-4">
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <SearchControl placeholder="Search by name & contact no..." />
        <PaginationControls totalPages={meta.total} limit={100} />
      </div>
      <div className="px-4">
        <CustomerTable customers={customers} />
      </div>
    </div>
  );
}
