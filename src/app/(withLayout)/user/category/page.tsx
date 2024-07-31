import { getAllCategories } from "@/api-services/category/getAllCategories";
import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import CategoryTable from "./categoryTable";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function Category({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge", "salesman"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";

  const { data: categories, meta } = await getAllCategories(
    `sort=status -createdAt&page=${page}&limit=${limit}${query && `&search=${query}`
    }&fields=name createdAt status`
  );

  return (
    <div className="card py-4 max-w-5xl mx-auto">
      <h2 className="sm:hidden block  pt-0 pb-2 px-4 mb-2 border-b font-bold text-lg">
        Category
      </h2>
      <div className="lg:hidden block pt-2 px-6 pb-4">
        <SearchControl placeholder="Search by name..." />
      </div>
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <div className="lg:block hidden">
          <SearchControl placeholder="Search by name..." />
        </div>
        <PaginationControls totalPages={meta.total ?? 0} limit={100} />
      </div>
      <div className="px-4">
        <CategoryTable categories={categories} />
      </div>
    </div>
  );
}
