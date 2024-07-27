"use client";

import { changePassword } from "@/api-services/auth/changePassword";
import { updateMyProfile } from "@/api-services/user/updateMyProfile.";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Textarea from "@/components/ui/form/Textarea";
import toastError from "@/helpers/toastError";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import { IUser } from "@/types/uesr";
import { useState, useRef } from "react";

export default function UserForm({ user }: { user: IUser }) {
  const { name, email, phoneNumber, address } = user;
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const payload = {
      name: (formData.get("name") ?? "") as string,
      phoneNumber: (formData.get("phoneNumber") ?? "") as string,
      address: (formData.get("address") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    await updateMyProfile(nonEmptyPayload);
    setLoading(false);
  };

  const handlePasswordSubmit = async (formData: FormData) => {
    setLoadingPassword(true);

    const oldPassword = (formData.get("oldPassword") ?? "") as string;
    const newPassword = (formData.get("newPassword") ?? "") as string;
    const confirmPassword = (formData.get("confirmPassword") ?? "") as string;

    if (!(newPassword === confirmPassword)) {
      toastError("Confirmp password does not match");
      setLoadingPassword(false);
      return false;
    }

    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    const result = await changePassword(payload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }
    }
    setLoadingPassword(false);
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 shadow">
        <h3 className="font-bold 2xl:text-lg text-base text-textPrimary mb-4">
          General
        </h3>
        <form action={handleSubmit} className="grid 2xl:space-y-4 space-y-3">
          <Input type="text" label="User Name" defaultValue={email} disabled />
          <Input
            type="text"
            name="name"
            label="Full Name"
            defaultValue={name}
            required
          />
          <Input
            type="text"
            name="phoneNumber"
            label="Phone Number"
            defaultValue={phoneNumber}
          />
          <Textarea name="address" label="Address" defaultValue={address} />
          <div>
            <Button type="submit" variant="primary" loading={loading}>
              Update profile
            </Button>
          </div>
        </form>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 shadow mt-5">
        <h3 className="font-bold 2xl:text-lg text-base text-textPrimary mb-4">
          Change Password
        </h3>
        <form
          ref={formRef}
          action={handlePasswordSubmit}
          className="grid 2xl:space-y-4 space-y-3"
        >
          <Input
            type="password"
            name="oldPassword"
            label="Old Password"
            required
          />
          <Input
            type="password"
            name="newPassword"
            label="New Password"
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            required
          />
          <div>
            <Button type="submit" variant="primary" loading={loadingPassword}>
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
