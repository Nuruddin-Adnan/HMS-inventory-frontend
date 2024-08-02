"use client";

import { updateCustomer } from "@/api-services/customer/updateCustomer";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function CustomerUpdateForm({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
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
        status: (formData.get("status") ?? "") as string,
      };

      const nonEmptyPayload = removeEmptyFields(payload);
      const result = await updateCustomer(data._id!, nonEmptyPayload);
      if (result && result.success === true) {
        // Reset the form
        if (formRef.current) {
          formRef.current.reset();
        }

        await tagRevalidate("customer");
        router.back()
      }
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { title: "active", value: "active" },
    { title: "deactive", value: "deactive" },
  ];

  const genderOptions = [
    { title: "Male", value: "male" },
    { title: "Female", value: "female" },
    { title: "Other", value: "other" },
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
          <div className="lg:col-span-2">
            <Input
              type="text"
              name="name"
              label="Customer Name*"
              defaultValue={data?.name}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-3 2xl:gap-4 gap-3">
            <Select
              options={statusOptions}
              defaultValue={data?.status}
              name="status"
              label="Status"
              className="min-h-[34px]"
            />
            <Input
              type="number"
              name="age"
              label="Age"
              defaultValue={data?.age}
            />
            <Select
              options={genderOptions}
              defaultValue={data?.gender}
              name="gender"
              label="Gender*"
              className="min-h-[34px]"
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 2xl:gap-4 gap-3">
          <Input
            type="text"
            name="contactNo"
            label="Contact No*"
            defaultValue={data?.contactNo}
          />
          <Input
            type="email"
            name="email"
            label="Email Address"
            defaultValue={data?.email}
          />
        </div>
        <Textarea label="Address" name="address" defaultValue={data?.address} />
        <div className="text-right">
          <Button
            type="button"
            variant="danger"
            onClick={() => router.back()}
            className="me-2"
          >
            Back
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Update Customer
          </Button>
        </div>
      </form>
    </div>
  );
}
