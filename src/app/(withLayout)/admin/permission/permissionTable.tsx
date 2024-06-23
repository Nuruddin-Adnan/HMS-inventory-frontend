"use client";

import { deletePermission } from "@/api-services/permission/deletePermission";
import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import tagRevalidate from "@/lib/tagRevalidate";
import { IPermission } from "@/types/permission";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function PermissionTable({
  permissions,
}: {
  permissions: IPermission[];
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

  const columns = [{ key: "name", label: "Name" }];

  const handleEdit = (rowKey: any) => {
    // Implement edit logic here
    router.push(`/admin/permission/update/${rowKey}`);
  };

  const handleDelete = (rowKey: any) => {
    // Implement delete logic here
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deletePermission(rowKey);
        await tagRevalidate('permission')
      }
    })
  };


  return (
    <div>
      {/* Table component */}
      <Table
        title="Permission"
        columns={columns}
        data={permissions}
        uniqueKey="_id"
        customTfClass="text-right whitespace-nowrap"
        create={role === "super_admin" ? "/admin/permission/create" : undefined}
        onEdit={handleEdit}
        onDelete={handleDelete}
        action={role === "super_admin" && true}
        responsive
        search
        sort
        print
        serialized
      />
    </div>
  );
}
