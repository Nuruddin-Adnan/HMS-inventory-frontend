"use client";

import { createStockAdjustment } from "@/api-services/stock-adjustment/createStockAdjustment";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { reactSelectStyles } from "@/styles/reactSelectStyles";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import ReactSelect, { SelectInstance } from "react-select";

export default function StockAdjustmentCreateForm({ products }: { products: any }) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const productSelectRef = useRef<SelectInstance | null>(null);

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
        product: product?.value?._id,
        quantity: quantityAsNumber,
        causes: (formData.get("causes") ?? "") as string,
        description: (formData.get("description") ?? "") as string,
      };

      const nonEmptyPayload = removeEmptyFields(payload);
      const result = await createStockAdjustment(nonEmptyPayload);
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

  const productOptions = products.map((product: any) => ({
    value: product.product[0],
    label: `${product.product[0]?.name} ⟶${product.product[0]?.brand}`,
  }));

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
            <label className="lg:col-span-2">
              <span className="text-textPrimary font-semibold block pb-0.5">Product Name</span>
              <ReactSelect
                ref={productSelectRef}
                name="product"
                options={productOptions}
                styles={reactSelectStyles}
                value={product}
                onChange={(value: any) => {
                  setProduct(value)
                }}
                required
              />
            </label>
            <div className="grid grid-cols-2 2xl:gap-4 gap-3">
              <Input label="Unit" value={product?.value?.unit} readOnly />
              <Input label="Price" value={product?.value?.price} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2 2xl:gap-4 gap-3">
            <Input type="number" name="quantity" label="Product quantity*" required />
            <Select options={causesOptions} label="Causes" name="causes" className="min-h-[34px]" />
          </div>
          <Textarea name="description" label="Description" rows={5} />
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
              Create
            </Button>
          </div>
        </form>
      </div>

    </>
  );
}
