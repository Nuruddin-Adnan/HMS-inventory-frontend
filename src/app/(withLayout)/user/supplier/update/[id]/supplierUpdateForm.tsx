"use client";

import { updateSupplier } from "@/api-services/supplier/updateSupplier";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import Textarea from "@/components/ui/form/Textarea";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import { genderOptions, statusOptions } from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { redirect } from "next/navigation";
import { useState, useRef } from "react";
import ReactSelect, { SelectInstance } from "react-select";

export default function SupplierUpdateForm({ data, brands }: { data: any, brands: any }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const brandSelectRef = useRef<SelectInstance | null>(null);

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
      status: (formData.get("status") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await updateSupplier(data._id!, nonEmptyPayload);
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
        <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
          <div className="lg:col-span-2">
            <Input
              type="text"
              name="name"
              label="Supplier Name*"
              defaultValue={data?.name}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-3 2xl:gap-4 gap-3">
            <Select
              options={statusOptions}
              defaultValue={data?.status}
              name="status"
              label="Status"
              className="min-h-[34px]"
            />
            <Input
              type="number"
              name="age"
              label="Age"
              defaultValue={data?.age}
            />
            <Select
              options={genderOptions}
              defaultValue={data?.gender}
              name="gender"
              label="Gender*"
              className="min-h-[34px]"
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
          <label>
            <span className="font-semibold block pb-0.5">Select Brand</span>
            <ReactSelect
              ref={brandSelectRef}
              name="brand"
              options={brandOptions}
              defaultValue={{ label: data.brand?.name, value: data.brand?._id }}
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
            />
          </label>
          <Input
            type="text"
            name="contactNo"
            label="Contact No*"
            defaultValue={data?.contactNo}
          />
          <Input
            type="email"
            name="email"
            label="Email Address"
            defaultValue={data?.email}
          />
        </div>
        <Textarea label="Address" name="address" defaultValue={data?.address} />
        <div className="text-right">
          <Button type="submit" variant="primary" loading={loading}>
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
