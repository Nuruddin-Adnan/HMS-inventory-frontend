"use client";

import { createUser } from "@/api-services/auth/createUser";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/ui/form/Checkbox";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import toastError from "@/helpers/toastError";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { IPermission } from "@/types/permission";
import { redirect, useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function UserForm({ data }: { data: IPermission[] }) {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter()

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
    const password = (formData.get("password") ?? "") as string;
    const confirmPassword = (formData.get("confirmPassword") ?? "") as string;

    if (!(password === confirmPassword)) {
      toastError("Confirmp password does not match");
      setLoading(false);
      return false;
    }

    const formDatas = new FormData();

    formDatas.append("name", formData.get("name") as string);
    formDatas.append("email", formData.get("email") as string);
    formDatas.append("phoneNumber", formData.get("phoneNumber") as string);
    formDatas.append("role", formData.get("role") as string);
    formDatas.append("password", formData.get("password") as string);
    if (formData.get("department")) {
      formDatas.append("department", formData.get("department") as string);
    }
    formDatas.append("address", formData.get("address") as string);
    formDatas.append("seal", formData.get("seal") as string);
    formDatas.append("signature", formData.get("signature") as File);
    formDatas.append("permission", permissions as unknown as string);

    const result = await createUser(formDatas);
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

  const roleOptions = [
    { title: "admin", value: "admin" },
    { title: "account admin", value: "account_admin" },
    { title: "store incharge", value: "store_incharge" },
    { title: "general user", value: "general_user" },
    { title: "salesman", value: "salesman" },
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <h3 className="font-semibold 2xl:text-md text-base text-primary mb-4">
        GENERAL
      </h3>
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:space-y-4 space-y-3"
        encType="multipart/form-data"
      >
        <div className="grid lg:grid-cols-2 2xl:gap-4 gap-3">
          <Input type="text" name="email" label="User Name/email*" />
          <Select
            options={roleOptions}
            name="role"
            label="User Role*"
            className="min-h-[34px]"
          />
        </div>
        <div className="grid xl:grid-cols-3 2xl:gap-4 gap-3">
          <Input type="text" name="name" label="Full Name*" />
          <Input type="text" name="phoneNumber" label="Phone Number" />
          <Input
            type="file"
            name="signature"
            label="Signature"
            className="lg:h-[34px]"
          />
        </div>
        <div className="grid lg:grid-cols-2 2xl:gap-4 gap-3">
          <Textarea name="address" label="Address" />
          <Textarea name="seal" label="Seal" />
        </div>
        <h3 className="font-semibold 2xl:text-md text-base text-primary mb-4 pt-4">
          PERMISSION
        </h3>
        <div className="2xl:columns-5 xl:columns-4 columns-3">
          {data.map((item) => (
            <Checkbox
              key={item._id}
              name={item._id}
              value={item._id}
              inlineClassName="items-center"
              label={item.name}
              onChange={() => handlePermissionChange(item._id!)}
            />
          ))}
        </div>
        <h3 className="font-semibold 2xl:text-md text-base text-primary mb-4 pt-4">
          SECURITY
        </h3>
        <Input type="password" name="password" label="Password*" />
        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password*"
        />
        <div className="text-right">
          <Button type='reset' variant='danger' className="me-2" onClick={() => router.back()}>Back</Button>
          <Button type="submit" variant="primary" loading={loading}>
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
}
