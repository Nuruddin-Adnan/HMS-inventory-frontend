"use client";

import { orderRefund } from "@/api-services/order/orderRefund";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { toFixedIfNecessary } from "@/helpers/toFixedIfNecessary";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import { refundMethodOptions } from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderRefundForm({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any>([]);

  const {
    BILLID,
    subtotal,
    discountAmount,
    discountPercent,
    vatPercent,
    total,
    due,
    received,
    items,
    customer,
    totalRefundAmount,
  } = data;

  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      // Convert  fields as number
      // const amount = (formData.get("amount") ?? "") as string;
      // const amountAsNumber: number = convertStringToNumber(amount);

      const payload = {
        refundMethod: (formData.get("refundMethod") ?? "") as string,
      };

      const nonEmptyPayload = removeEmptyFields(payload);
      const result = await orderRefund(data?.BILLID, nonEmptyPayload);
      if (result && result.success === true) {
        await tagRevalidate("order");
        router.back();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 xl:flex-row h-[calc(100vh-86px)]">
        <div className="w-full xl:w-[70%]">
          <div className="bg-gray-200 rounded p-4">
            <div className="flex items-center gap-5  max-w-lg">
              <h2 className="text-base font-bold whitespace-nowrap flex-shrink-0">
                Invoice No
              </h2>
              <span className="font-bold">:</span>
              <input
                type="text"
                value={BILLID}
                onFocus={(e: any) => e.target.select()}
                className="border border-gray-300 p-2 w-full rounded"
                readOnly
              />
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Customer contact"
                    name="contactNo"
                    className="py-1.5"
                    labelClassName="text-base"
                    value={customer[0]?.contactNo}
                    onFocus={(e: any) => e.target.select()}
                    readOnly
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    label="Customer Name"
                    className="py-1.5"
                    labelClassName="text-base"
                    value={customer[0]?.name}
                    readOnly
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    label="Points"
                    className="py-1.5"
                    labelClassName="text-base"
                    value={customer[0]?.points}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="overflow-x-auto h-[calc(100vh-264px)] overflow-auto">
              <table className="min-w-full bg-white">
                <thead className="">
                  <tr>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      <input type="checkbox" disabled />
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Product
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Refund Quantity
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Quantity
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Unit
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Price
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((product: any, index: number) => (
                    <tr key={index}>
                      <td className="py-1 px-4 border text-center">
                        <input type="checkbox" />
                      </td>
                      <td className="py-1 px-4 border">
                        {product?.productName[0]?.name}
                      </td>
                      <td className="py-1 px-4 border">
                        <div className="flex items-center justify-center">
                          <button className="bg-gray-300 text-gray-700 py-[5.5px] px-1 rounded-l">
                            <MinusIcon className="w-5 h-5" />
                          </button>
                          <input
                            type="number"
                            onFocus={(e: any) => e.target.select()}
                            className="border px-0.5 py-1 w-12 text-center font-medium"
                          />
                          <button className="bg-gray-300 text-gray-700 py-[5.5px] px-1 rounded-r">
                            <PlusIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {product?.quantity}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {product?.unit}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {product?.price}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {product?.price * product?.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[30%] p-4 rounded flex flex-col justify-between bg-gray-200">
          <div className="mb-4">
            <h2 className="text-lg font-bold bg-blue-500 bg-opacity-20 text-blue-700 py-1 px-4 rounded  grid grid-cols-5">
              <span className="col-span-2">Total </span> <span>:</span>{" "}
              <span className="col-span-2">
                {toFixedIfNecessary(total, 2)} TK
              </span>
            </h2>
            <h2 className="text-lg font-bold bg-green-500 bg-opacity-20 text-green-700 py-1 px-4 rounded mt-2 grid grid-cols-5">
              <span className="col-span-2">Total Paid </span> <span>:</span>
              <span className="col-span-2">
                {" "}
                {toFixedIfNecessary(received, 2)} TK
              </span>
            </h2>
            <h2 className="text-lg font-bold bg-yellow-500 bg-opacity-20 text-yellow-700 py-1 px-4 rounded mt-2  grid grid-cols-5">
              <span className="col-span-2">Due </span> <span>:</span>{" "}
              <span className="col-span-2">
                {toFixedIfNecessary(due, 2)} TK
              </span>
            </h2>
            <h2 className="text-lg font-bold bg-red-500 bg-opacity-20 text-red-700 py-1 px-4 rounded mt-2 mb-5 grid grid-cols-5">
              <span className="col-span-2">Refund Amount </span> <span>:</span>{" "}
              <span className="col-span-2">
                {toFixedIfNecessary(totalRefundAmount, 2)} TK
              </span>
            </h2>
          </div>

          <form
            // ref={formRef}
            action={handleSubmit}
            className="lg:sticky bottom-5"
          >
            <div className="flex justify-between text-base whitespace-nowrap">
              <div className="grid 2xl:gap-4 gap-3 w-full">
                <div className="grid  space-y-1 text-right items-center">
                  <p className="text-textPrimary font-bold ">Subtotal : </p>
                  <p className="text-textPrimary font-bold">{subtotal} TK</p>

                  <p className="text-textPrimary">Discount % :</p>
                  <div className="relative ml-auto w-2/3">
                    <Input
                      id="discountPercent"
                      name="discountPercent"
                      type="number"
                      value={discountPercent}
                      onFocus={(e: any) => e.target.select()}
                      className="pr-6 border-blue-300 py-0.5"
                      readOnly
                    />
                    <span className="absolute top-1/2 right-2 -translate-y-1/2">
                      %
                    </span>
                  </div>

                  <p className="text-textPrimary">Discount :</p>
                  <div className="relative ml-auto w-2/3">
                    <Input
                      type="number"
                      defaultValue={discountAmount}
                      onFocus={(e: any) => e.target.select()}
                      className="pr-6 border-blue-300 py-0.5"
                      readOnly
                    />
                    <span className="absolute top-1/2 right-2 -translate-y-1/2">
                      TK
                    </span>
                  </div>

                  <p className="text-textPrimary">Vat % :</p>
                  <div className="relative ml-auto w-2/3">
                    <Input
                      name="vatPercent"
                      type="number"
                      className="pr-6 border-blue-300 py-0.5"
                      value={vatPercent}
                      onFocus={(e: any) => e.target.select()}
                      readOnly
                    />
                    <span className="absolute top-1/2 right-2 -translate-y-1/2">
                      %
                    </span>
                  </div>

                  <div className="border-b col-span-2 border-b-gray-100"></div>

                  <p className="text-textPrimary">Refund Method :</p>
                  <div className="relative ml-auto w-2/3">
                    <Select
                      options={refundMethodOptions}
                      name="refundMethod"
                      className="text-base border-blue-300"
                      labelClassName="text-base whitespace-nowrap"
                      inline
                      defaultValue="cash"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right flex gap-2 text-base mt-5">
              <Button
                type="button"
                variant="primary-light"
                onClick={() => router.back()}
              >
                Back
              </Button>
              {!loading && (
                <button
                  type="submit"
                  className="bg-red-500 text-white py-2 px-4 rounded w-full font-semibold"
                >
                  Refund
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
