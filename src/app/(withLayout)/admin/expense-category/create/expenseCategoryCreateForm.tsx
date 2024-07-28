"use client";

import { createExpenseCategory } from "@/api-services/expense-category/createExpenseCategory";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { redirect, useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function ExpenseCategoryCreateForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const payload = {
      name: (formData.get("name") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await createExpenseCategory(nonEmptyPayload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }

      await tagRevalidate("expense-category");
      redirect("/admin/expense-category");
    }
    setLoading(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <Input type="text" name="name" label="Expense category Name*" autoFocus />
        <div className="text-right">
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
