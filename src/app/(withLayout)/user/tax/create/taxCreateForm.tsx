"use client";

import { createTax } from "@/api-services/tax/createTax";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import { taxOptions } from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { redirect, useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function TaxCreateForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    const tax = (formData.get("tax") ?? "") as string;
    const taxAsNumber: number = convertStringToNumber(tax);

    const payload = {
      purpose: (formData.get("purpose") ?? "") as string,
      tax: taxAsNumber,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await createTax(nonEmptyPayload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }

      await tagRevalidate("tax");
      redirect("/user/tax");
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
        <Input type="number" name="tax" label="Tax %*" autoFocus />
        <Select options={taxOptions} name="purpose" label="Purpose*" />
        <div className="text-right">
          <Button
            variant="primary-light"
            className="mr-2"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-10"
            loading={loading}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
