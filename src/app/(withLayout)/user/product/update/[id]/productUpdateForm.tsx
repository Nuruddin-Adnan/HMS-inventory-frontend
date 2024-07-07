"use client";

import { updateProduct } from "@/api-services/product/updateProduct";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { productUnitOptions, statusOptions } from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import ReactSelect, { SelectInstance } from "react-select";
import CreatableSelect from "react-select/creatable";

export default function ProductUpdateForm({
  data,
  categories,
  brands,
  generics,
  shelves,
}: {
  data: any;
  categories: any;
  brands: any;
  generics: any;
  shelves: any;
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const unitSelectRef = useRef<SelectInstance | null>(null);
  const fullUnitSelectRef = useRef<SelectInstance | null>(null);
  const brandSelectRef = useRef<SelectInstance | null>(null);
  const genericSelectRef = useRef<SelectInstance | null>(null);
  const shelveSelectRef = useRef<SelectInstance | null>(null);

  const router = useRouter();

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
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    // Convert  fields as number
    const price = (formData.get("price") ?? "") as string;
    const fullPrice = (formData.get("fullPrice") ?? "") as string;
    const discountPercent = (formData.get("discountPercent") ?? "") as string;
    const discountAmount = (formData.get("discountAmount") ?? "") as string;

    const priceAsNumber: number = convertStringToNumber(price);
    const fullPriceAsNumber: number = convertStringToNumber(fullPrice);
    const discountPercentAsNumber: number =
      convertStringToNumber(discountPercent);
    const discountAmountAsNumber: number =
      convertStringToNumber(discountAmount);

    const payload = {
      name: (formData.get("name") ?? "") as string,
      code: (formData.get("code") ?? "") as string,
      category: (formData.get("category") ?? "") as string,
      genericName: (formData.get("genericName") ?? "") as string,
      brand: (formData.get("brand") ?? "") as string,
      shelve: (formData.get("shelve") ?? "") as string,
      unit: (formData.get("unit") ?? "") as string,
      fullUnit: (formData.get("fullUnit") ?? "") as string,
      price: priceAsNumber,
      fullPrice: fullPriceAsNumber,
      discountPercent: discountPercentAsNumber,
      discountAmount: discountAmountAsNumber,
      description: (formData.get("description") ?? "") as string,
      status: (formData.get("status") ?? "") as string,
    };

    const result = await updateProduct(data._id!, payload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }

      await tagRevalidate("product");
      await tagRevalidate("stock");
      await tagRevalidate("purchase");
      router.back();
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
    return { label: `${item?.name}`, value: item?.name };
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <div className="grid lg:grid-cols-4 2xl:gap-4 gap-3">
          <div className="lg:col-span-2">
            <Input
              type="text"
              name="name"
              label="Product Name*"
              defaultValue={data?.name}
              autoFocus
            />
          </div>
          <div className="grid col-span-2 grid-cols-3 2xl:gap-4 gap-3">
            <Input
              type="text"
              name="code"
              label="Product Code"
              defaultValue={data?.code}
            />
            <Select
              options={categoryOptions}
              name="category"
              label="Select category*"
              className="min-h-[34px]"
              defaultValue={data?.category[0]?._id}
            />
            <Select
              options={statusOptions}
              name="status"
              label="Status*"
              className="min-h-[34px]"
              defaultValue={data?.status}
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
          <label>
            <span className="font-semibold block pb-0.5">Generic Name</span>
            <ReactSelect
              ref={genericSelectRef}
              name="genericName"
              isClearable={true}
              options={genericOptions}
              styles={reactSelectStyles}
              defaultValue={{
                label: data?.genericName,
                value: data?.genericName,
              }}
            />
          </label>
          <label>
            <span className="font-semibold block pb-0.5">Brand*</span>
            <ReactSelect
              ref={brandSelectRef}
              name="brand"
              options={brandOptions}
              styles={reactSelectStyles}
              defaultValue={{ label: data?.brand, value: data?.brand }}
            />
          </label>
          <label>
            <span className="font-semibold block pb-0.5">Select Shelve</span>
            <ReactSelect
              ref={shelveSelectRef}
              name="shelve"
              isClearable={true}
              options={shelveOptions}
              styles={reactSelectStyles}
              defaultValue={{
                label: data?.shelve,
                value: data?.shelve,
              }}
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
              defaultValue={{ label: data?.unit, value: data?.unit }}
            />
          </label>
          <Input
            type="number"
            name="price"
            label="Product price*"
            defaultValue={data?.price}
          />
          <Input
            type="number"
            name="discountPercent"
            label="Discount %*"
            defaultValue={data?.discountPercent}
          />
          <Input
            type="number"
            name="discountAmount"
            label="Discount Amount"
            defaultValue={data?.discountAmount}
          />
        </div>
        <div className="grid lg:grid-cols-2 2xl:gap-4 gap-3">
          <label>
            <span className="font-semibold block pb-0.5">
              Sell Full Unit{" "}
              <span className="font-normal opacity-80">(Optional)</span>
            </span>
            <CreatableSelect
              ref={fullUnitSelectRef}
              name="fullUnit"
              options={productUnitOptions}
              isClearable={true}
              styles={reactSelectStyles}
              defaultValue={{ label: data?.fullUnit, value: data?.fullUnit }}
            />
          </label>
          <Input
            type="number"
            name="fullPrice"
            label="Full Unit price (Optional)"
            defaultValue={data?.fullPrice}
          />
        </div>
        <Textarea
          label="Description"
          name="description"
          defaultValue={data?.description}
        />
        <div className="text-right">
          <Button
            type="button"
            variant="primary-light"
            className="me-2"
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
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
