"use client";

import { createSupplier } from "@/api-services/supplier/createSupplier";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import tagRevalidate from "@/lib/tagRevalidate";
import { redirect, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import ReactSelect, { SelectInstance } from "react-select";

export default function SupplierCreateForm({ brands }: { brands: any }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const brandSelectRef = useRef<SelectInstance | null>(null);

  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    // Convert age fields as number
    const age = (formData.get("age") ?? "") as string;
    const ageAsNumber: number = convertStringToNumber(age);

    const payload = {
      name: (formData.get("name") ?? "") as string,
      age: ageAsNumber,
      gender: (formData.get("gender") ?? "") as string,
      brand: (formData.get("brand") ?? "") as string,
      contactNo: (formData.get("contactNo") ?? "") as string,
      email: (formData.get("email") ?? "") as string,
      address: (formData.get("address") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await createSupplier(nonEmptyPayload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }

      await tagRevalidate("supplier");
      redirect("/user/supplier");
    }
    setLoading(false);
  };

  const genderOptions = [
    { title: "Male", value: "male" },
    { title: "Female", value: "female" },
    { title: "Other", value: "other" },
  ];

  const brandOptions = brands.map((item: any) => {
    return { label: `${item?.name}`, value: item?._id };
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow">
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <div className="grid lg:grid-cols-4 2xl:gap-4 gap-3">
          <div className="lg:col-span-3">
            <Input type="text" name="name" label="Supplier Name*" autoFocus />
          </div>
          <div className="grid grid-cols-2 2xl:gap-4 gap-3">
            <Input type="number" name="age" label="Age" />
            <Select
              options={genderOptions}
              name="gender"
              label="Gender*"
              className="min-h-[34px]"
              required
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
          <label>
            <span className="text-textPrimary font-semibold block pb-0.5">Select Brand</span>
            <ReactSelect
              ref={brandSelectRef}
              name="brand"
              options={brandOptions}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  minHeight: "auto",
                  color: "#18181B",
                  padding: "0px",
                  border: "1px solid #e5e7eb",
                }),
                indicatorsContainer: (provided) => ({
                  ...provided,
                  padding: "0px",
                  minHeight: "auto",
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  padding: "0px 4px",
                }),
              }}
              required
            />
          </label>
          <Input type="text" name="contactNo" label="ContactNo*" required />
          <Input type="email" name="email" label="Email Address" />
        </div>
        <Textarea label="Address" name="address" />
        <div className="text-right">
          <Button type="button" variant="danger" className="mr-2" onClick={() => router.back()}>
            Back
          </Button>
          <Button type="submit" variant="primary" className="px-10" loading={loading}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
