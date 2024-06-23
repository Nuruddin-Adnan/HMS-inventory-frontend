import React from "react";
import { getSingleUser } from "@/api-services/user/getSingleUser";
import UserUpdateForm from "./userUpdateForm";
import { getAllPermissions } from "@/api-services/permission/getAllPermissions";

export default async function UpdateUser({
  params,
}: {
  params: { id: string };
}) {
  const userPromise = getSingleUser(params.id);
  const permissionsPromise = getAllPermissions();

  const [user, permissions] = await Promise.all([userPromise, permissionsPromise])

  return (
    <div>
      <div className="card mx-auto">
        <div className="border-b border-gray-200 2xl:p-4 p-3">
          <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
            Update User
          </h2>
        </div>
        <div className="2xl:px-4 px-3 2xl:py-5 py-4">
          <UserUpdateForm data={user?.data} permissionsData={permissions?.data} />
        </div>
      </div>
    </div>
  );
}
