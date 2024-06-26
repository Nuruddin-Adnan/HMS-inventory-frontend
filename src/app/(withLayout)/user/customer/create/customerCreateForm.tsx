"use client";

import { createCustomer } from "@/api-services/customer/createCustomer";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { redirect } from "next/navigation";
import { useState, useRef } from "react";

export default function CustomerCreateForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    // Convert age fields as number
    const age = (formData.get("age") ?? "") as string;
    const ageAsNumber: number = convertStringToNumber(age);

    const payload = {
      name: (formData.get("name") ?? "") as string,
      age: ageAsNumber,
      gender: (formData.get("gender") ?? "") as string,
      contactNo: (formData.get("contactNo") ?? "") as string,
      email: (formData.get("email") ?? "") as string,
      address: (formData.get("address") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await createCustomer(nonEmptyPayload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }

      await tagRevalidate("customer");
      redirect("/user/customer");
    }
    setLoading(false);
  };

  const genderOptions = [
    { title: "Male", value: "male" },
    { title: "Female", value: "female" },
    { title: "Other", value: "other" },
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <div className="grid lg:grid-cols-4 2xl:gap-4 gap-3">
          <div className="lg:col-span-3">
            <Input type="text" name="name" label="Customer Name*" autoFocus />
          </div>
          <div className="grid grid-cols-2 2xl:gap-4 gap-3">
            <Input type="number" name="age" label="Age" />
            <Select
              options={genderOptions}
              name="gender"
              label="Gender*"
              className="min-h-[34px]"
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 2xl:gap-4 gap-3">
          <Input type="text" name="contactNo" label="Contact No*" />
          <Input type="email" name="email" label="Email Address" />
        </div>
        <Textarea label="Address" name="address" />
        <div className="text-right">
          <Button type="submit" variant="primary" loading={loading}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
