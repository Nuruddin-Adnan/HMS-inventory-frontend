"use client";

import { updateShelve } from "@/api-services/shelve/updateShelve";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function ShelveUpdateForm({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const payload = {
        name: (formData.get("name") ?? "") as string,
        description: (formData.get("description") ?? "") as string,
        status: (formData.get("status") ?? "") as string,
      };

      const nonEmptyPayload = removeEmptyFields(payload);
      const result = await updateShelve(data._id!, nonEmptyPayload);
      if (result && result.success === true) {
        // Reset the form
        if (formRef.current) {
          formRef.current.reset();
        }

        await tagRevalidate("shelve");
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
              label="Shelve Name*"
              defaultValue={data.name}
            />
          </div>
          <Select
            options={statusOptions}
            name="status"
            label="Status*"
            defaultValue={data?.status}
          />
        </div>
        <Textarea label="Items description" name="description" rows={7} defaultValue={data?.description} />
        <div className="text-right flex items-center justify-end">
          <Button
            type="reset"
            variant="danger"
            className="mr-2"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button type="submit" variant="primary" className="px-10" loading={loading}>
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
