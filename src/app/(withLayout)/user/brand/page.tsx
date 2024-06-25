import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import BrandTable from "./brandTable";
import { getAllBrands } from "@/api-services/brand/getAllBrands";

export default async function Brand({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";

  const { data: brands, meta } = await getAllBrands(
    `sort=status -createdAt&page=${page}&limit=${limit}${query && `&search=${query}`
    }&fields=name createdAt status`
  );

  return (
    <div className="card py-4">
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <SearchControl placeholder="Search by name..." />
        <PaginationControls totalPages={meta.total} limit={100} />
      </div>
      <div className="px-4">
        <BrandTable brands={brands} />
      </div>
    </div>
  );
}
