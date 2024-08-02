"use client";

import { createExpense } from "@/api-services/expense/createExpense";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function ExpenseForm({ expenseCategories }: { expenseCategories: any }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter()

  const categoryOptions = expenseCategories.map((item: any) => {
    return { title: `${item?.name}`, value: item?.name };
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const amount = (formData.get("amount") ?? "") as string;


      const amountAsNumber: number = convertStringToNumber(amount);

      const payload = {
        purpose: (formData.get("purpose") ?? "") as string,
        expenseDate: (formData.get("expenseDate") ?? "") as string,
        amount: amountAsNumber,
        description: (formData.get("description") ?? "") as string,
      };

      const nonEmptyPayload = removeEmptyFields(payload);
      const result = await createExpense(nonEmptyPayload);
      if (result && result.success === true) {
        // Reset the form
        if (formRef.current) {
          formRef.current.reset();
        }
        await tagRevalidate("expense");
        router.back();
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
        className="grid 2xl:space-y-4 space-y-3"
      >
        <Select
          options={categoryOptions}
          name="purpose"
          label="Select purpose of expense*"
          className="min-h-[34px]"
          required
        />
        <div className="grid grid-cols-2 2xl:space-x-4 space-x-3">
          <Input type="date" name="expenseDate" label="Expense Date" defaultValue={format(new Date(), 'yyyy-MM-dd')} required />
          <Input type="number" name="amount" label="Amount" required />
        </div>
        <Textarea name="description" label="Description" rows={6} />
        <div className="text-right flex items-center justify-end">
          <Link href={`/user/expense`} >
            <Button type="button" variant="danger" className="mr-2">
              Back
            </Button>
          </Link>
          <Button type="submit" variant="primary" loading={loading}>
            Create expense
          </Button>
        </div>
      </form>
    </div>
  );
}
