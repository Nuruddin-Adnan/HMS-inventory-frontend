"use client";

import { updatePartialStock } from "@/api-services/stock/updatePartialStock";
import { updateStock } from "@/api-services/stock/updateStock";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { getUser } from "@/lib/getUser";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import { statusOptions } from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { redirect } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import ReactSelect, { SelectInstance } from "react-select";

export default function StockUpdateForm({
  data,
  products,
}: {
  data: any;
  products: any;
}) {
  const [role, updateRole] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const productSelectRef = useRef<SelectInstance | null>(null);

  const user = getUser();

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== "undefined") {
      if (user) {
        updateRole(user.role);
      }
    }
  }, [user]);

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
    const quantity = (formData.get("quantity") ?? "") as string;
    const alertQuantity = (formData.get("alertQuantity") ?? "") as string;

    const quantityAsNumber: number = convertStringToNumber(quantity);
    const alertQuantityAsNumber: number = convertStringToNumber(alertQuantity);

    const payload = {
      product: (formData.get("product") ?? "") as string,
      quantity: quantityAsNumber,
      alertQuantity: alertQuantityAsNumber,
      status: (formData.get("status") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = new Set(["super_admin", "admin"]).has(role)
      ? await updateStock(data._id!, nonEmptyPayload)
      : await updatePartialStock(data._id!, nonEmptyPayload);
    if (result && result.success === true) {
      // Reset the form
      if (formRef.current) {
        formRef.current.reset();
      }

      await tagRevalidate("stock");
      redirect("/user/stock");
    }
    setLoading(false);
  };

  const productOptions = products.map((item: any) => {
    return { label: `${item?.name}`, value: item?._id };
  });

  if (new Set(["super_admin", "admin"]).has(role)) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 shadow">
        <form
          ref={formRef}
          action={handleSubmit}
          className="grid 2xl:gap-4 gap-3"
        >
          <label>
            <span className="font-semibold block pb-0.5">Product Name</span>
            <ReactSelect
              ref={productSelectRef}
              name="product"
              options={productOptions}
              styles={reactSelectStyles}
              defaultValue={{
                label: `${data?.product[0]?.name} ⟶${data?.product[0]?.brand}`,
                value: data?.product[0]?._id,
              }}
            />
          </label>
          <div className="grid lg:grid-cols-3 2xl:gap-4 gap-3">
            <Select
              options={statusOptions}
              name="status"
              label="Status*"
              defaultValue={data?.status}
            />
            <Input
              type="number"
              name="quantity"
              label="Product quantity*"
              defaultValue={data?.quantity}
            />
            <Input
              type="number"
              name="alertQuantity"
              label="Alert Quantity*"
              defaultValue={data?.alertQuantity}
            />
          </div>
          <div className="text-right">
            <Button type="submit" variant="primary" loading={loading}>
              Update
            </Button>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <form
        ref={formRef}
        action={handleSubmit}
        className="grid 2xl:gap-4 gap-3"
      >
        <label>
          <span className="font-semibold block pb-0.5">Product Name</span>
          <ReactSelect
            ref={productSelectRef}
            name="product"
            options={productOptions}
            styles={reactSelectStyles}
            defaultValue={{
              label: `${data?.product[0]?.name} ⟶${data?.product[0]?.brand}`,
              value: data?.product[0]?._id,
            }}
            isDisabled={true}
          />
        </label>
        <div className="grid lg:grid-cols-2 2xl:gap-4 gap-3">
          <Select
            options={statusOptions}
            name="status"
            label="Status*"
            defaultValue={data?.status}
          />
          <Input
            type="number"
            name="alertQuantity"
            label="Alert Quantity*"
            defaultValue={data?.alertQuantity}
          />
        </div>
        <div className="text-right">
          <Button type="submit" variant="primary" loading={loading}>
            Update
          </Button>
        </div>
      </form>
    );
  }
}
