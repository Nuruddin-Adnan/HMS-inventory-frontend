import PaginationControls from "@/components/ui/PaginationControls";
import { getAllShelves } from "@/api-services/shelve/getAllShelves";
import ShelveTable from "./shelveTable";
import SearchControl from "@/components/ui/SearchControl";

export default async function Shelve({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";

  const { data: shelves, meta } = await getAllShelves(
    `sort=status -createdAt&page=${page}&limit=${limit}${query && `&search=${query}`
    }&fields=name createdAt status`
  );

  return (
    <div className="card py-4">
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <SearchControl placeholder="Search by name..." />
        <PaginationControls totalPages={meta.total ?? 0} limit={100} />
      </div>
      <div className="px-4">
        <ShelveTable shelves={shelves} />
      </div>
    </div>
  );
}
