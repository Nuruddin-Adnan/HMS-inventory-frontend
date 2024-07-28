import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import { getSingleExpense } from "@/api-services/expense/getSingleExpense";
import ExpenseUpdateForm from "./expenseUpdateForm";
import { getAllExpenseCategories } from "@/api-services/expense-category/getAllExpenseCategories";

export default async function UpdateExpense({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin", "store_incharge"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const expensePromise = getSingleExpense(params.id);
  const expenseCategoriesPromise = getAllExpenseCategories("status=active&fields=name _id");

  const [expense, expenseCategories] = await Promise.all([expensePromise, expenseCategoriesPromise])

  return (
    <div>
      <div className="card mx-auto max-w-5xl">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Update Expense
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <ExpenseUpdateForm data={expense?.data} expenseCategories={expenseCategories?.data} />
        </div>
      </div>
    </div>
  );
}
