"use client";

import { updatePurchase } from "@/api-services/purchase/updatePurchase";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import { productUnitOptions } from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { reactSelectStyles } from "@/styles/reactSelectStyles";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";

export default function PurchaseUpdateForm({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const payload = {
      invoiceNo: (formData.get("invoiceNo") ?? "") as string,
      lotNo: (formData.get("lotNo") ?? "") as string,
      expiryDate: (formData.get("expiryDate") ?? "") as string,
    };

    const nonEmptyPayload = removeEmptyFields(payload);
    const result = await updatePurchase(data?.BILLID, nonEmptyPayload);
    if (result && result.success === true) {
      await tagRevalidate("purchase");
      router.back();
    }
    setLoading(false);
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 shadow">
        <form className="mb-4">
          <span className="block text-sm font-semibold text-textPrimary mb-1">
            Product code
          </span>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              name="code"
              className="border-primary focus-visible:border-primary focus:border-primary"
              value={data?.product[0]?.code}
              disabled
            />
          </div>
        </form>
        <form action={handleSubmit} className="grid 2xl:gap-4 gap-3">
          <div className="flex 2xl:gap-4 gap-3 lg:flex-row flex-col">
            <div className="lg:w-3/5 flex flex-col 2xl:gap-4 gap-3">
              <label>
                <span className="text-textPrimary font-semibold block pb-0.5">
                  Product Name*
                </span>
                <ReactSelect
                  name="product"
                  styles={reactSelectStyles}
                  value={{
                    label: `${data?.product[0]?.name} ⟶${data?.product[0]?.genericName} ⟶${data?.product[0]?.brand}`,
                    value: data?.product[0]?._id,
                  }}
                  isDisabled={true}
                />
              </label>
              <div className="grid grid-cols-2 2xl:gap-4 gap-3">
                <label>
                  <span className="text-textPrimary font-semibold block pb-0.5">Supplier*</span>
                  <ReactSelect
                    name="supplier"
                    styles={reactSelectStyles}
                    value={{
                      label: `${data?.supplier?.name} ⟶${data?.supplier?.contactNo} ⟶${data?.supplier?.brandInfo?.name}`,
                      value: data?.supplier[0]?._id,
                    }}
                    isDisabled={true}
                  />
                </label>
                <Input
                  type="text"
                  name="invoiceNo"
                  label="Invoice No"
                  defaultValue={data?.invoiceNo}
                />
              </div>
              <div className="grid grid-cols-2 2xl:gap-4 gap-3">
                <Input
                  type="text"
                  name="lotNo"
                  label="Lot No"
                  defaultValue={data?.lotNo}
                />
                <Input
                  type="date"
                  name="expiryDate"
                  label="Expiry Date"
                  defaultValue={format(
                    new Date(data?.expiryDate),
                    "yyyy-MM-dd"
                  )}
                />
              </div>
            </div>
            <div className="lg:w-2/5 2xl:gap-4 gap-3 lg:border-s lg:ps-4">
              <div className="grid lg:gap-52 gap-16">
                <div className="grid  gap-3">
                  <label className="lg:flex items-center gap-4">
                    <span className="text-textPrimary font-semibold block lg:w-1/3">
                      Purchase Unit:
                    </span>
                    <div className="lg:w-2/3">
                      <CreatableSelect
                        name="unit"
                        options={productUnitOptions}
                        isClearable={true}
                        styles={reactSelectStyles}
                        defaultValue={{
                          label: data?.unit,
                          value: data?.unit,
                        }}
                        isDisabled={true}
                      />
                    </div>
                  </label>
                  <Input
                    type="number"
                    name="quantity"
                    label="Product quantity"
                    inline
                    className="lg:w-2/3"
                    labelClassName="lg:w-1/3"
                    value={data?.quantity}
                    disabled
                  />
                  {
                    data?.refundQuantity > 0 &&
                    <Input
                      type="number"
                      name="refundQuantity"
                      label="Refund quantity"
                      inline
                      className="lg:w-2/3 border-red-500"
                      labelClassName="lg:w-1/3"
                      value={data?.refundQuantity}
                      disabled
                    />
                  }
                  <Input
                    type="number"
                    name="price"
                    label="Unit price"
                    inline
                    className="lg:w-2/3"
                    labelClassName="lg:w-1/3"
                    value={data?.price}
                    disabled
                  />
                </div>
                <div className="lg:sticky bottom-5">
                  <div className="flex space-x-4 justify-between text-base">
                    <div className="grid 2xl:gap-4 gap-3 w-full">
                      <div className="grid  space-y-1 text-right items-center">
                        <p className="text-textPrimary font-bold whitespace-nowrap">
                          Net Payable Amount :
                        </p>
                        <p className="text-textPrimary font-bold whitespace-nowrap">
                          {data?.total} TK
                        </p>

                        <div className="border-b col-span-2"></div>

                        <p className="text-textPrimary whitespace-nowrap">
                          Advance Amount :
                        </p>
                        <div className="relative ml-auto w-2/3">
                          <Input
                            name="advance"
                            type="number"
                            step="0.001"
                            className="pr-6 border-blue-300"
                            defaultValue={data?.advance}
                            required
                            disabled
                          />
                          <span className="absolute top-1/2 right-2 -translate-y-1/2">
                            TK
                          </span>
                        </div>

                        <p className="text-textPrimary font-bold">
                          Due Amount :
                        </p>
                        <p className="text-textPrimary font-bold">
                          {data?.due}
                          TK
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-base mt-5">
                    <Button
                      variant="danger"
                      className="mr-2"
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-48 justify-center"
                      loading={loading}
                    >
                      Purchase Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
