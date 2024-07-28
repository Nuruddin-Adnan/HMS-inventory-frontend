import React from "react";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";
import ExpenseCategoryUpdateForm from "./expenseCategoryUpdateForm";
import { getSingleExpenseCategory } from "@/api-services/expense-category/getSingleExpenseCategory";

export default async function UpdateExpenseCategory({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin",]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const { data } = await getSingleExpenseCategory(params.id);

  return (
    <div>
      <div className="card mx-auto max-w-5xl">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Update Expense Category
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <ExpenseCategoryUpdateForm data={data} />
        </div>
      </div>
    </div>
  );
}
