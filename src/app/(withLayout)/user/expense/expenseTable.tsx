"use client";

import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import tagRevalidate from "@/lib/tagRevalidate";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "core-js";
import { format } from "date-fns";
import { deleteExpense } from "@/api-services/expense/deleteExpense";

export default function ExpenseTable({
  expenses,
}: {
  expenses: any[];
}) {
  const [role, updateRole] = useState("");
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== "undefined") {
      if (user) {
        updateRole(user.role);
      }
    }
  }, [user]);

  const columns = [
    {
      key: "expenseDate",
      label: "Expense Date",
      customClass: "pl-8",
      render: (row: any) => {
        return <span className="whitespace-nowrap">
          {format(new Date(row?.expenseDate), 'dd/MMM/yyyy p')}
        </span>
      }
    },
    { key: "purpose", label: "Purpose", render: (row: any) => <div className="whitespace-nowrap">{row?.purpose}</div>, },
    { key: "description", label: "Description" },
    {
      key: "amount",
      label: "Amount",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => <div className="capitalize text-right font-medium pr-4">{row?.amount}</div>,
    },
    {
      key: "createdAt",
      label: "Entry",
      render: (row: any) => {
        return <span className="whitespace-nowrap">
          {format(new Date(row?.createdAt), 'dd/MMM/yyyy p')}
          <br />
          By: {row.createdBy?.name}
        </span>
      }
    },
    {
      key: "updatedAt",
      label: "Edited",
      render: (row: any) => {
        return <span className="whitespace-nowrap">
          {row.updatedBy && format(new Date(row?.updatedAt), 'dd/MMM/yyyy p')}
          <br />
          {row.updatedBy && <span> By: {row.updatedBy?.name}</span>}
        </span>
      }
    },
  ];

  const handleEdit = (rowKey: any) => {
    // Implement edit logic here
    router.push(`/user/expense/update/${rowKey}`);
  };

  const handleDelete = (rowKey: any) => {
    // Implement delete logic here
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteExpense(rowKey);
        await tagRevalidate("expense");
      }
    });
  };

  return (
    <div>
      {/* Table component */}
      <Table
        title="Expenses"
        columns={columns}
        data={expenses}
        uniqueKey="_id"
        customTdClass="py-0.5 align-top"
        customTfClass="text-right whitespace-nowrap"
        create="/user/expense/create"
        onEdit={handleEdit}
        onDelete={role === "super_admin" ? handleDelete : undefined}
        action={true}
        responsive
        search
        sort
        print
        serialized
      />
    </div>
  );
}
