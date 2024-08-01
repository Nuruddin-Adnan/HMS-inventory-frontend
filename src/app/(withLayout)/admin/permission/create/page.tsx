import React from "react";
import PermissionForm from "./permissionForm";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function CreatePermission() {
  const user = getUserServer();

  if (!(user!.role === "super_admin")) {
    redirect("/");
  }

  return (
    <div>
      <div className="card mx-auto max-w-xl">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Create Permission
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <PermissionForm />
        </div>
      </div>
    </div>
  );
}
