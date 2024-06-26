"use client";

import { createProduct } from "@/api-services/product/createProduct";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import { productUnitOptions } from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { redirect } from "next/navigation";
import { useState, useRef } from "react";
import ReactSelect, { SelectInstance } from "react-select";
import CreatableSelect from 'react-select/creatable';


export default function ProductCreateForm({ categories, brands, generics, shelves }: { categories: any, brands: any, generics: any, shelves: any }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const unitSelectRef = useRef<SelectInstance | null>(null);
  const brandSelectRef = useRef<SelectInstance | null>(null);
  const genericSelectRef = useRef<SelectInstance | null>(null);
  const shelveSelectRef = useRef<SelectInstance | null>(null);

  const reactSelectStyles = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      minHeight: "auto",
      color: "#18181B",
      padding: "0px",
      border: "1px solid #e5e7eb",
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      padding: "0px",
      minHeight: "auto",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: "0px 4px",
    }),
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    // Convert  fields as number
    const price = (formData.get("price") ?? "") as string;
    const discountPercent = (formData.get("discountPercent") ?? "") as string;
    const discountAmount = (formData.get("discountAmount") ?? "") as string;

    const priceAsNumber: number = convertStringToNumber(price);
    const discountPercentAsNumber: number = convertStringToNumber(discountPercent);
    const discountAmountAsNumber: number = convertStringToNumber(discountAmount);

    const payload = {
      name: (formData.get("name") ?? "") as string,
      category: (formData.get("category") ?? "") as string,
      genericName: (formData.get("genericName") ?? "") as string,
      brand: (formData.get("brand") ?? "") as string,
      shelve: (formData.get("shelve") ?? "") as string,
      unit: (formData.get("unit") ?? "") as string,
      price: priceAsNumber,
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

  const shelveOptions = shelves.map((item: any) => {
    return { label: `${item?.name}`, value: item?._id };
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
          <div className="lg:col-span-2">
            <Input type="text" name="name" label="Product Name*" autoFocus />
          </div>
          <div className="grid 2xl:gap-4 gap-3">
            <Select
              options={categoryOptions}
              name="category"
              label="Select category*"
              className="min-h-[34px]"
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
          <label>
            <span className="font-semibold block pb-0.5">Generic Name</span>
            <ReactSelect
              ref={genericSelectRef}
              name="genericName"
              options={genericOptions}
              styles={reactSelectStyles}
            />
          </label>
          <label>
            <span className="font-semibold block pb-0.5">Brand*</span>
            <ReactSelect
              ref={brandSelectRef}
              name="brand"
              options={brandOptions}
              styles={reactSelectStyles}
            />
          </label>
          <label>
            <span className="font-semibold block pb-0.5">Select Shelve</span>
            <ReactSelect
              ref={shelveSelectRef}
              name="shelve"
              options={shelveOptions}
              styles={reactSelectStyles}
            />
          </label>
        </div>

        <div className="grid lg:grid-cols-4 grid-cols-2 2xl:gap-4 gap-3">
          <label>
            <span className="font-semibold block pb-0.5">Sell Unit*</span>
            <CreatableSelect
              ref={unitSelectRef}
              name="unit"
              options={productUnitOptions}
              styles={reactSelectStyles}
            />
          </label>
          <Input type="number" name="price" label="Product price*" />
          <Input type="number" name="discountPercent" label="Discount %*" defaultValue={0} />
          <Input type="number" name="discountAmount" label="Discount Amount*" defaultValue={0} />
        </div>
        <Textarea label="Description" name="description" />
        <div className="text-right">
          <Button type="submit" variant="primary" loading={loading}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
