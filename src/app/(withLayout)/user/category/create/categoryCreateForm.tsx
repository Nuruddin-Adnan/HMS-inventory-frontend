"use client";

import { createCategory } from "@/api-services/category/createCategory";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { redirect, useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function CategoryCreateForm() {
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
      };

      const nonEmptyPayload = removeEmptyFields(payload);
      const result = await createCategory(nonEmptyPayload);
      if (result && result.success === true) {
        // Reset the form
        if (formRef.current) {
          formRef.current.reset();
        }

        await tagRevalidate("category");
        router.back()
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <Input type="text" name="name" label="Category Name*" autoFocus />
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
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
