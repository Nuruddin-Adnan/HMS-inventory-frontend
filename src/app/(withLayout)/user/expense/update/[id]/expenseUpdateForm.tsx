"use client";

import { updateExpense } from "@/api-services/expense/updateExpense";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState, useRef } from "react";

export default function ExpenseUpdateForm({
  data,
  expenseCategories
}: {
  data: any
  expenseCategories: any
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const categoryOptions = expenseCategories.map((item: any) => {
    return { title: `${item?.name}`, value: item?.name };
  });

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    const amount = (formData.get("amount") ?? "") as string;
    const amountAsNumber: number = convertStringToNumber(amount);

    const payload = {
      purpose: (formData.get("purpose") ?? "") as string,
      expenseDate: (formData.get("expenseDate") ?? "") as string,
      amount: amountAsNumber,
      description: (formData.get("description") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await updateExpense(data._id!, nonEmptyPayload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }
      setLoading(false);

      await tagRevalidate("expense");
      redirect("/user/expense");
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:space-y-4 space-y-3"
      >
        <Select
          options={categoryOptions}
          defaultValue={data?.purpose}
          name="purpose"
          label="Select purpose of expense*"
          className="min-h-[34px]"
          required
        />
        <div className="grid grid-cols-2 2xl:space-x-4 space-x-3">
          <Input type="date" name="expenseDate" label="Expense Date" defaultValue={new Date(data.expenseDate).toISOString().split('T')[0]} />
          <Input type="number" name="amount" label="Amount" defaultValue={data?.amount} />
        </div>
        <Textarea name="description" label="Description" defaultValue={data?.description} />
        <div className="text-right">
          <Link href={`/user/expense`} >
            <Button type="submit" variant="danger" className="mr-2" loading={loading}>
              Back
            </Button>
          </Link>
          <Button type="submit" variant="primary" loading={loading}>
            Update expense
          </Button>
        </div>
      </form>
    </div>
  );
}
