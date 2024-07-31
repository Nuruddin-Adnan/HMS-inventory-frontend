"use client";

import { createProduct } from "@/api-services/product/createProduct";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import {
  medicineFormulationOptions,
  productUnitOptions,
} from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { reactSelectStyles } from "@/styles/reactSelectStyles";
import { redirect, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import ReactSelect, { SelectInstance } from "react-select";
import CreatableSelect from "react-select/creatable";

export default function ProductCreateForm({
  categories,
  brands,
  generics,
}: {
  categories: any;
  brands: any;
  generics: any;
}) {
  const [loading, setLoading] = useState(false);
  const [productCode, setProductCode] = useState<any>();
  const formRef = useRef<HTMLFormElement>(null);
  const unitSelectRef = useRef<SelectInstance | null>(null);
  const brandSelectRef = useRef<SelectInstance | null>(null);
  const genericSelectRef = useRef<SelectInstance | null>(null);
  const formulaltionSelectRef = useRef<SelectInstance | null>(null);

  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    // Convert  fields as number
    const price = (formData.get("price") ?? "") as string;
    const discountPercent = (formData.get("discountPercent") ?? "") as string;
    const discountAmount = (formData.get("discountAmount") ?? "") as string;
    const stripQuantity = (formData.get("stripQuantity") ?? "") as string;

    const priceAsNumber: number = convertStringToNumber(price);
    const discountPercentAsNumber: number =
      convertStringToNumber(discountPercent);
    const discountAmountAsNumber: number =
      convertStringToNumber(discountAmount);
    const stripQuantityAsNumber: number = convertStringToNumber(stripQuantity);

    const payload = {
      name: (formData.get("name") ?? "") as string,
      code: productCode,
      category: (formData.get("category") ?? "") as string,
      genericName: (formData.get("genericName") ?? "") as string,
      strength: (formData.get("strength") ?? "") as string,
      brand: (formData.get("brand") ?? "") as string,
      formulation: (formData.get("formulation") ?? "") as string,
      unit: (formData.get("unit") ?? "") as string,
      price: priceAsNumber,
      stripQuantity: stripQuantityAsNumber,
      discountPercent: discountPercentAsNumber,
      discountAmount: discountAmountAsNumber,
      description: (formData.get("description") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await createProduct(nonEmptyPayload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }

      await tagRevalidate("product");
      redirect("/user/product");
    }
    setLoading(false);
  };

  const categoryOptions = categories.map((item: any) => {
    return { title: `${item?.name}`, value: item?._id };
  });

  const brandOptions = brands.map((item: any) => {
    return { label: `${item?.name}`, value: item?.name };
  });

  const genericOptions = generics.map((item: any) => {
    return { label: `${item?.name}`, value: item?.name };
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <Input
        type="text"
        name="code"
        label="Product Code"
        className="border-primary mb-4 focus-visible:border-primary focus:border-primary"
        value={productCode}
        onChange={(e: any) => setProductCode(e.target.value)}
        autoFocus
        onFocus={(e: any) => e.target.select()}
      />
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <Select
          options={categoryOptions}
          name="category"
          label="Select category*"
          className="min-h-[34px]"
        />
        <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
          <div className="lg:col-span-2">
            <Input type="text" name="name" label="Product Name*" />
          </div>
          <label>
            <span className="font-semibold block pb-0.5">Generic Name</span>
            <ReactSelect
              ref={genericSelectRef}
              name="genericName"
              options={genericOptions}
              isClearable={true}
              styles={reactSelectStyles}
            />
          </label>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 2xl:gap-4 gap-3">
          <Input label="Strength" name="strength" />
          <label>
            <span className="font-semibold block pb-0.5">Formulation</span>
            <CreatableSelect
              ref={formulaltionSelectRef}
              name="formulation"
              options={medicineFormulationOptions}
              isClearable={true}
              styles={reactSelectStyles}
            />
          </label>
          <label>
            <span className="font-semibold block pb-0.5">Brand*</span>
            <ReactSelect
              ref={brandSelectRef}
              name="brand"
              options={brandOptions}
              isClearable={true}
              styles={reactSelectStyles}
            />
          </label>
          <Input
            type="number"
            label="Strip quantity"
            name="stripQuantity"
          />
        </div>

        <div className="grid lg:grid-cols-4 grid-cols-2 2xl:gap-4 gap-3">
          <label>
            <span className="font-semibold block pb-0.5">Sell Unit*</span>
            <CreatableSelect
              ref={unitSelectRef}
              name="unit"
              options={productUnitOptions}
              isClearable={true}
              styles={reactSelectStyles}
            />
          </label>
          <Input type="number" name="price" label="Unit price*" />
          <Input
            type="number"
            name="discountPercent"
            label="Discount %*"
            defaultValue={0}
          />
          <Input
            type="number"
            name="discountAmount"
            label="Discount Amount*"
            defaultValue={0}
          />
        </div>
        <Textarea label="Description" name="description" />
        <div className="text-right">
          <Button
            type="reset"
            variant="danger"
            className="mr-2"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
