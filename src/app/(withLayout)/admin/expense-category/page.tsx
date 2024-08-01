import PaginationControls from "@/components/ui/PaginationControls";
import SearchControl from "@/components/ui/SearchControl";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getAllExpenseCategories } from "@/api-services/expense-category/getAllExpenseCategories";
import ExpenseCategoryTable from "./expenseCategoryTable";

export default async function ExpenseCategory({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "100";
  const query = searchParams["query"] ?? "";

  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const { data: expenseCategories, meta } = await getAllExpenseCategories(
    `sort=status -createdAt&page=${page}&limit=${limit}${query && `&search=${query}`
    }&fields=name createdAt status`
  );

  return (
    <div className="card py-4 max-w-5xl mx-auto">
      <div className="pl-4 pr-8 flex justify-end -mb-12 gap-2">
        <SearchControl placeholder="Search by name..." />
        <PaginationControls totalPages={meta.total ?? 0} limit={100} />
      </div>
      <div className="px-4">
        <ExpenseCategoryTable expenseCategories={expenseCategories} />
      </div>
    </div>
  );
}