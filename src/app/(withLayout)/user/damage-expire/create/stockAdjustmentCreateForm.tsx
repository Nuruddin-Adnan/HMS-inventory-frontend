"use client";

import { createStockAdjustment } from "@/api-services/stock-adjustment/createStockAdjustment";
import { getAllStocksClient } from "@/api-services/stock/getAllStocksClient";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import toastError from "@/helpers/toastError";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { reactSelectStyles } from "@/styles/reactSelectStyles";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { SelectInstance } from "react-select";
import AsyncSelect from 'react-select/async';

export default function StockAdjustmentCreateForm() {
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

  // Product options fetch
  const loadProductOptions = async (inputValue: string) => {
    if (!inputValue.trim()) return []; // Return empty array for empty input
    try {

      // Fetch data from backend based on input value
      const { data: stocks } = await getAllStocksClient(
        `search=${inputValue}&status=active&sort=name&nestedFilter=true&fields=product&limit=20`
      );

      return stocks.map((stock: any) => ({
        label: `${stock?.product[0]?.name} ${stock?.product[0]?.genericName ? `⟶${stock?.product[0]?.genericName}` : ""
          } ⟶${stock?.product[0]?.brand}`,
        value: stock?.product[0],
      }));
    } catch (error) {
      toastError(error);
      return [];
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
            <label className="lg:col-span-2">
              <span className="text-textPrimary font-semibold block pb-0.5">Product Name</span>
              <AsyncSelect
                ref={productSelectRef}
                isClearable={true}
                name="product"
                styles={reactSelectStyles}
                cacheOptions
                defaultOptions
                loadOptions={loadProductOptions}
                value={product}
                onChange={(value: any) => setProduct(value)}
                placeholder="Select a product"
                required
              />
            </label>
            <div className="grid grid-cols-2 2xl:gap-4 gap-3">
              <Input label="Unit" value={product?.value?.unit} readOnly className="read-only:bg-gray-100" />
              <Input label="Price" value={product?.value?.price} readOnly className="read-only:bg-gray-100" />
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
