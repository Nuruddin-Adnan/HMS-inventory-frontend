"use client";

import { refundPurchase } from "@/api-services/purchase/refundPurchase";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import { paymentMethodOptions, refundMethodOptions } from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { reactSelectStyles } from "@/styles/reactSelectStyles";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactSelect from "react-select";

export default function PurchaseRefundForm({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);
  const [refundQuantity, setRefundQuantity] = useState<number>(0);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      // Convert  fields as number
      const quantity = (formData.get("quantity") ?? "") as string;
      const quantityAsNumber: number = convertStringToNumber(quantity);

      const payload = {
        refundMethod: (formData.get("refundMethod") ?? "") as string,
        quantity: quantityAsNumber,
      };

      const nonEmptyPayload = removeEmptyFields(payload);

      const result = await refundPurchase(data?.BILLID, nonEmptyPayload);
      if (result && result.success === true) {
        await tagRevalidate("purchase");
        router.back();
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 shadow">
        <form onSubmit={handleSubmit} className="grid 2xl:gap-4 gap-3">
          <div className="flex 2xl:gap-4 gap-3 lg:flex-row flex-col">
            <div className="lg:w-3/5 flex flex-col 2xl:gap-4 gap-3">
              <div className="grid lg:grid-cols-3  2xl:gap-4 gap-3">
                <label className="lg:col-span-2">
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
                <Input
                  type="text"
                  name="code"
                  label="Product code"
                  value={data?.product[0]?.code}
                  disabled
                />
              </div>
              <div className="grid grid-cols-2 2xl:gap-4 gap-3">
                <label>
                  <span className="text-textPrimary font-semibold block pb-0.5">Supplier*</span>
                  <ReactSelect
                    name="supplier"
                    styles={reactSelectStyles}
                    value={{
                      label: `${data?.supplier?.name} ⟶${data?.supplier?.contactNo} ⟶${data?.supplier?.brandInfo[0]?.name}`,
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
                  disabled
                />
              </div>
              <div className="grid grid-cols-2 2xl:gap-4 gap-3">
                <Input
                  type="text"
                  name="lotNo"
                  label="Lot No"
                  defaultValue={data?.lotNo}
                  disabled
                />
                <Input
                  type="date"
                  name="expiryDate"
                  label="Expiry Date"
                  defaultValue={format(
                    new Date(data?.expiryDate),
                    "yyyy-MM-dd"
                  )}
                  disabled
                />
              </div>
            </div>
            <div className="lg:w-2/5 2xl:gap-4 gap-3 lg:border-s lg:ps-4">
              <div className="grid 2xl:gap-52 gap-16">
                <div className="grid  gap-3">
                  <Input
                    type="text"
                    name="unit"
                    label="Unit"
                    inline
                    className="lg:w-2/3 border-red-500"
                    labelClassName="lg:w-1/3"
                    value={data?.unit}
                    disabled
                  />
                  <Input
                    type="number"
                    name="quantity"
                    label="Purchase quantity"
                    inline
                    className="lg:w-2/3 border-red-500"
                    labelClassName="lg:w-1/3"
                    value={data?.quantity}
                    disabled
                  />
                  <Input
                    type="number"
                    name="price"
                    label="Unit price"
                    inline
                    className="lg:w-2/3 border-red-500"
                    labelClassName="lg:w-1/3"
                    value={data?.price}
                    disabled
                  />
                </div>
                <div className="lg:sticky bottom-5">
                  <div className="flex lg:flex-row flex-col gap-4 justify-between text-base whitespace-nowrap ">
                    <div className="space-y-2 lg:w-1/3">
                      <Select
                        options={paymentMethodOptions}
                        name="refundMethod"
                        label="Refund Method"
                        labelClassName="text-base"
                        defaultValue="cash"
                      />
                    </div>
                    <div className="grid 2xl:gap-4 gap-3 lg:w-2/3">
                      <div className="grid  space-y-1 text-right items-center">
                        <p className="text-textPrimary font-bold">
                          Payable Amount :
                        </p>
                        <p className="text-textPrimary font-bold">
                          {data?.total - refundQuantity * data?.price} TK
                        </p>
                        <p className="text-textPrimary font-bold">
                          Previous Payment :
                        </p>
                        <p className="text-textPrimary font-bold">
                          {data?.advance} TK
                        </p>
                        <p className="text-textPrimary font-bold">
                          Due Amount :
                        </p>
                        <p>
                          {data?.due}
                          TK
                        </p>

                        <div className="border-b col-span-2"></div>

                        <p className="text-red-500">Previous Refund:</p>
                        <div className="relative ml-auto w-2/3">
                          <Input
                            type="number"
                            className="text-red-500 border-red-500 text-right"
                            value={data?.refundQuantity}
                            disabled
                          />
                        </div>

                        <p className="text-red-500 font-semibold">New Refund Quantity:</p>
                        <div className="relative ml-auto w-2/3">
                          <Input
                            name="quantity"
                            type="number"
                            className="text-red-500 border-red-500 text-right"
                            onChange={(e: any) =>
                              setRefundQuantity(e.target.value)
                            }
                            autoFocus
                          />
                        </div>

                        <p
                          className={`font-medium ${data?.quantity -
                            (data?.refundQuantity + Number(refundQuantity)) <
                            0
                            ? "text-red-500"
                            : "text-green-700"
                            }`}
                        >
                          Remaining quantity :
                        </p>
                        <p
                          className={`font-medium ${data?.quantity -
                            (data?.refundQuantity + Number(refundQuantity)) <
                            0
                            ? "text-red-500"
                            : "text-green-700"
                            }`}
                        >
                          {data?.quantity -
                            (data?.refundQuantity + Number(refundQuantity))}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-base mt-5 flex items-center justify-end">
                    <Button
                      variant="primary-light"
                      className="mr-2"
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="danger"
                      className="w-48 justify-center"
                      loading={loading}
                    >
                      Refund Purchase
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
