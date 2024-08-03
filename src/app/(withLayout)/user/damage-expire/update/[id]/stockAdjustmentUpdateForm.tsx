"use client";

import { updateStockAdjustment } from "@/api-services/stock-adjustment/updateStockAdjustment";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function StockAdjustmentUpdateForm({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      // Convert  fields as number
      const quantity = (formData.get("quantity") ?? "") as string;

      const quantityAsNumber: number = convertStringToNumber(quantity);

      const payload = {
        quantity: quantityAsNumber,
        causes: (formData.get("causes") ?? "") as string,
        description: (formData.get("description") ?? "") as string,
      };

      const nonEmptyPayload = removeEmptyFields(payload);
      const result = await updateStockAdjustment(data?._id, nonEmptyPayload);
      if (result && result.success === true) {
        // Reset the form
        if (formRef.current) {
          formRef.current.reset();
        }

        await tagRevalidate("stock-adjustment");
        router.back();
      }
    } finally {
      setLoading(false);
    }
  };


  const causesOptions = [
    { title: "Damage", value: "damage" },
    { title: "Expired", value: "expired" },
    { title: "Lost", value: "lost" },
    { title: "Others", value: "others" }
  ];


  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 shadow">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid 2xl:gap-4 gap-3"
        >
          <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
            <div className="lg:col-span-2">
              <Input label="Product Name" value={data?.productName} disabled />
            </div>
            <div className="grid grid-cols-2 2xl:gap-4 gap-3">
              <Input label="Unit" value={data?.unit} disabled />
              <Input label="Price" value={data?.price} disabled />
            </div>
          </div>
          <div className="grid grid-cols-2 2xl:gap-4 gap-3">
            <Input type="number" name="quantity" label="Product quantity*" className="border-primary" defaultValue={data?.quantity} required />
            <Select options={causesOptions} label="Causes" name="causes" className="min-h-[34px] border-primary" defaultValue={data?.causes} />
          </div>
          <Textarea name="description" label="Description" rows={5} defaultValue={data?.description} />
          <div className="text-right flex items-center justify-end">
            <Button
              type="button"
              variant="danger"
              className="me-2"
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

    </>
  );
}
