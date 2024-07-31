"use client";

import { updateProduct } from "@/api-services/product/updateProduct";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import {
  medicineFormulationOptions,
  productUnitOptions,
  statusOptions,
} from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { reactSelectStyles } from "@/styles/reactSelectStyles";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import ReactSelect, { SelectInstance } from "react-select";
import CreatableSelect from "react-select/creatable";

export default function ProductUpdateForm({
  data,
  categories,
  brands,
  generics,
}: {
  data: any;
  categories: any;
  brands: any;
  generics: any;
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const unitSelectRef = useRef<SelectInstance | null>(null);
  const brandSelectRef = useRef<SelectInstance | null>(null);
  const genericSelectRef = useRef<SelectInstance | null>(null);
  const formulaltionSelectRef = useRef<SelectInstance | null>(null);
  const [discountAmount, setDiscountAmount] = useState<any>(
    data?.discountAmount
  );
  const [discountPercent, setDiscountPercent] = useState<any>(
    data?.discountPercent
  );

  let productName = ''

  // remove formulation from name
  if (data?.formulation) {
    productName = data?.name
      .replace(`(${data?.formulation})`, '')
      .trim();
  }

  // remove strength from name
  if (data?.strength) {
    productName = productName
      .replace(data?.strength, '')
      .trim();
  }

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
      code: (formData.get("code") ?? "") as string,
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

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <div className="grid  lg:grid-cols-3 2xl:gap-4 gap-3">
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
        <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
          <div className="lg:col-span-2 col-span-4">
            <Input
              type="text"
              name="name"
              label="Product Name*"
              defaultValue={productName}
              autoFocus
            />
          </div>
          <div>
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
          </div>
        </div>
        <div className="grid lg:grid-cols-4 2xl:gap-4 gap-3">

          <Input label="Strength" name="strength" defaultValue={data?.strength} />
          <label>
            <span className="font-semibold block pb-0.5">Formulation</span>
            <CreatableSelect
              ref={formulaltionSelectRef}
              name="formulation"
              options={medicineFormulationOptions}
              isClearable={true}
              styles={reactSelectStyles}
              defaultValue={{
                label: data?.formulation,
                value: data?.formulation,
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
          <Input
            type="number"
            label="Strip quantity"
            name="stripQuantity"
            defaultValue={data?.stripQuantity}
          />
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
            value={discountPercent}
            onChange={(e: any) => {
              setDiscountPercent(e.target.value);
              setDiscountAmount((e.target.value / 100) * data?.price);
            }}
          />
          <Input
            type="number"
            name="discountAmount"
            label="Discount Amount"
            value={discountAmount}
            onChange={(e: any) => {
              setDiscountAmount(e.target.value);
              setDiscountPercent((e.target.value / data?.price) * 100);
            }}
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
            variant="danger"
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
