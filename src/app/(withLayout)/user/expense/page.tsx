import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import PaginationControls from "@/components/ui/PaginationControls";
import { Suspense } from "react";
import ExpenseTable from "./expenseTable";
import { getAllExpenses } from "@/api-services/expense/getAllExpenses";

export default async function Expense({
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
  const limit = searchParams["limit"] ?? "10";

  const { data: expenses, meta } = await getAllExpenses(
    `sort=-createdAt&page=${page}&limit=${limit}&fields=expenseDate purpose description amount createdBy updatedBy createdAt updatedAt`
  );

  return (
    <div className="card pb-4 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ExpenseTable expenses={expenses} />
      </Suspense>
      <div className="py-2 px-4 flex justify-end">
        <PaginationControls totalPages={meta.total ?? 0} limit={10} />
      </div>
    </div>
  );
}
