/* eslint-disable @next/next/no-img-element */
"use client";

import { resetPassword } from "@/api-services/auth/resetPassword";
import { updateUser } from "@/api-services/user/updateUser";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/ui/form/Checkbox";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import toastError from "@/helpers/toastError";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { IPermission } from "@/types/permission";
import { IUser } from "@/types/uesr";
import { redirect } from "next/navigation";
import { useState, useRef } from "react";
import noImage from "../../../../../../../public/no-image.jpg";
import Image from "next/image";
import { updateSignature } from "@/api-services/user/updateSignature";

export default function UserUpdateForm({
  data,
  permissionsData,
}: {
  data: IUser;
  permissionsData: IPermission[];
}) {
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [permissions, setPermissions] = useState<string[]>(
    data.permission?.map((item: any) => item._id) || []
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<any>();

  const {
    _id,
    name,
    role,
    email,
    phoneNumber,
    address,
    seal,
    signature,
    status,
    department,
  } = data;

  const handlePermissionChange = (value: string) => {
    // Update the state with the checked values
    setPermissions((prevValues) => {
      if (prevValues.includes(value)) {
        // If the value is already in the array, remove it
        return prevValues.filter((item) => item !== value);
      } else {
        // If the value is not in the array, add it
        return [...prevValues, value];
      }
    });
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    const payload = {
      email: (formData.get("email") ?? "") as string,
      role: (formData.get("role") ?? "") as string,
      department: (formData.get("department") ?? "") as string,
      name: (formData.get("name") ?? "") as string,
      phoneNumber: (formData.get("phoneNumber") ?? "") as string,
      address: (formData.get("address") ?? "") as string,
      seal: (formData.get("seal") ?? "") as string,
      status: (formData.get("status") ?? "") as string,
      permission: [""],
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    nonEmptyPayload.permission = permissions as never;
    const result = await updateUser(data._id!, nonEmptyPayload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }

      await tagRevalidate("user");
      redirect("/admin/user");
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (formData: FormData) => {
    setLoadingPassword(true);

    const password = (formData.get("password") ?? "") as string;
    const confirmPassword = (formData.get("confirmPassword") ?? "") as string;

    if (!(password === confirmPassword)) {
      toastError("Confirmp password does not match");
      setLoadingPassword(false);
      return false;
    }

    const payload = {
      password: password,
    };
    const result = await resetPassword(_id!, payload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }
    }
    setLoadingPassword(false);
  };

  const handleUpdateSignature = async (formData: FormData) => {
    const formDatas = new FormData();

    formDatas.append("signature", formData.get("signature") as File);
    const result = await updateSignature(_id!, formDatas);
    await tagRevalidate("user");
  };

  const roleOptions = [
    { title: "admin", value: "admin" },
    { title: "account admin", value: "account_admin" },
    { title: "store incharge", value: "store_incharge" },
    { title: "general user", value: "general_user" },
    { title: "salseman", value: "salseman" },
  ];

  const statusOptions = [
    { title: "active", value: "active" },
    { title: "deactive", value: "deactive" },
  ];


  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 shadow">
        <h3 className="font-semibold 2xl:text-md text-base text-primary mb-4">
          GENERAL
        </h3>
        <form
          ref={formRef}
          action={handleSubmit}
          className="grid 2xl:space-y-4 space-y-3"
        >
          <div className="grid lg:grid-cols-2 2xl:gap-4 gap-3">
            <Input
              type="text"
              name="email"
              label="User Name/email*"
              defaultValue={email}
            />
            <Select
              options={roleOptions}
              name="role"
              label="User Role*"
              defaultValue={role}
            />
          </div>
          <div className="grid xl:grid-cols-3 2xl:gap-4 gap-3">
            <Input
              type="text"
              name="name"
              label="Full Name*"
              defaultValue={name}
            />
            <Input
              type="text"
              name="phoneNumber"
              label="Phone Number"
              defaultValue={phoneNumber}
            />
            <Select
              options={statusOptions}
              name="status"
              label="User Status*"
              defaultValue={status}
            />
          </div>
          <div className="grid xl:grid-cols-2 2xl:gap-4 gap-3">
            <Textarea name="address" label="Address" defaultValue={address} />
            <Textarea name="seal" label="Seal" defaultValue={seal} />
          </div>
          <h3 className="font-semibold 2xl:text-md text-base text-primary mb-4 pt-4">
            PERMISSION
          </h3>
          <div className="2xl:columns-5 xl:columns-4 columns-3">
            {permissionsData.map((item) => (
              <Checkbox
                key={item._id}
                name={item._id}
                value={item._id}
                label={item.name}
                onChange={() => handlePermissionChange(item._id!)}
                defaultChecked={data.permission!.some(
                  (permission: any) => permission._id === item._id
                )}
              />
            ))}
          </div>
          <div className="text-right">
            <Button type="submit" variant="primary" loading={loading}>
              Update
            </Button>
          </div>
        </form>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 shadow mt-5">
        <h3 className="font-semibold 2xl:text-md text-base text-primary mb-4 pt-4">
          UPDATE SIGNATURE
        </h3>
        <form
          action={handleUpdateSignature}
          className="grid 2xl:space-y-4 space-y-3"
          encType="multipart/form-data"
        >
          {!(file || signature) ? (
            <Image src={noImage} alt="Defaul image" className="max-w-52" />
          ) : (
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${signature}`
              }
              alt="hello"
              className="max-w-52 object-cover border"
            />
          )}
          <div className="flex items-end gap-3">
            <Input
              type="file"
              name="signature"
              label="Upload new signature*"
              onChange={(e: any) => setFile(e.target.files[0])}
            />
            <div className="text-left">
              <Button type="submit" variant="primary">
                Update Signature
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 shadow mt-5">
        <h3 className="font-semibold 2xl:text-md text-base text-primary mb-4 pt-4">
          RESET PASSWORD
        </h3>
        <form
          ref={formRef}
          action={handlePasswordSubmit}
          className="grid 2xl:space-y-4 space-y-3"
        >
          <Input type="password" name="password" label="Password*" />
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password*"
          />
          <div className="text-right">
            <Button type="submit" variant="primary" loading={loadingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
