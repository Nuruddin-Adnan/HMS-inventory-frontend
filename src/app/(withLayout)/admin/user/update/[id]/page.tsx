import React from "react";
import { getSingleUser } from "@/api-services/user/getSingleUser";
import UserUpdateForm from "./userUpdateForm";
import { getAllPermissions } from "@/api-services/permission/getAllPermissions";
import { getUserServer } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function UpdateUser({
  params,
}: {
  params: { id: string };
}) {
  const user = getUserServer();

  const allowedRoles = new Set(["super_admin", "admin"]);
  if (!allowedRoles.has(user!?.role)) {
    redirect("/");
  }

  const userPromise = getSingleUser(params.id);
  const permissionsPromise = getAllPermissions();

  const [singleUser, permissions] = await Promise.all([userPromise, permissionsPromise])

  return (
    <div>
      <div className="card mx-auto max-w-6xl">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Update User
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <UserUpdateForm data={singleUser?.data} permissionsData={permissions?.data} />
        </div>
      </div>
    </div>
  );
}
