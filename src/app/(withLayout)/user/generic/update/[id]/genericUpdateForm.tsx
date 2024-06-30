"use client";

import { updateGeneric } from "@/api-services/generic/updateGeneric";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { redirect } from "next/navigation";
import { useState, useRef } from "react";

export default function GenericUpdateForm({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const payload = {
      name: (formData.get("name") ?? "") as string,
      status: (formData.get("status") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await updateGeneric(data._id!, nonEmptyPayload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }

      await tagRevalidate("generic");
      redirect("/user/generic");
    }
    setLoading(false);
  };

  const statusOptions = [
    { title: "active", value: "active" },
    { title: "deactive", value: "deactive" },
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <Input
          type="text"
          name="name"
          label="Generic Name*"
          defaultValue={data.name}
        />
        <Select
          options={statusOptions}
          name="status"
          label="Status*"
          defaultValue={data?.status}
        />
        <div className="text-right">
          <Button type="submit" variant="primary" loading={loading}>
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}