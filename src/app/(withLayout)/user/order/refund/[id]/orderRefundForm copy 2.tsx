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

  const handleQuantityChange = (index: number, amount: number) => {
    const updatedProducts = [...selectedProducts];
    const product = items[index];

    let existingProductIndex = updatedProducts.findIndex(
      (p) => p.product === product?.product
    );

    if (existingProductIndex === -1) {
      updatedProducts.push({
        product: product?.product,
        quantity: Math.max(amount, 0),
        amount: Math.max(amount, 0) * product.price,
      });
    } else {
      updatedProducts[existingProductIndex].quantity = Math.max(
        updatedProducts[existingProductIndex].quantity + amount,
        0
      );
      updatedProducts[existingProductIndex].amount =
        updatedProducts[existingProductIndex].quantity * product.price;

      if (updatedProducts[existingProductIndex].quantity === 0) {
        updatedProducts.splice(existingProductIndex, 1);
      }
    }

    setSelectedProducts(updatedProducts);
  };

  const handleRefundAmountChange = (index: number, amount: number) => {
    const updatedProducts = [...selectedProducts];
    const product = items[index];

    let existingProductIndex = updatedProducts.findIndex(
      (p) => p.product === product?.product
    );

    if (existingProductIndex === -1) {
      updatedProducts.push({
        product: product?.product,
        quantity: Math.floor(amount / product.price),
        amount: amount,
      });
    } else {
      updatedProducts[existingProductIndex].amount = Math.max(amount, 0);
      updatedProducts[existingProductIndex].quantity = Math.floor(
        amount / product.price
      );

      if (updatedProducts[existingProductIndex].amount === 0) {
        updatedProducts.splice(existingProductIndex, 1);
      }
    }

    setSelectedProducts(updatedProducts);
  };

  return (
    <>
      <div className="flex flex-col gap-3 xl:flex-row h-[calc(100vh-86px)]">
        <div className="w-full xl:w-[70%]">
          <div className="bg-gray-200 rounded p-4">
            <div className="flex items-center gap-5 max-w-lg">
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
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Refund Quantity
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Refund Amount
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
                      <td className="py-1 px-4 border">
                        <div className="flex items-center justify-center">
                          <button
                            className="bg-gray-300 text-gray-700 py-[5.5px] px-1 rounded-l"
                            onClick={() => handleQuantityChange(index, -1)}
                          >
                            <MinusIcon className="w-5 h-5" />
                          </button>
                          <input
                            type="number"
                            value={
                              selectedProducts.find(
                                (p: any) => p.product === product?.product
                              )?.quantity || 0
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                Number(e.target.value) -
                                  (selectedProducts.find(
                                    (p: any) => p.product === product?.product
                                  )?.quantity || 0)
                              )
                            }
                            onFocus={(e: any) => e.target.select()}
                            className="border px-0.5 py-1 w-12 text-center font-medium"
                          />
                          <button
                            className="bg-gray-300 text-gray-700 py-[5.5px] px-1 rounded-r"
                            onClick={() => handleQuantityChange(index, 1)}
                          >
                            <PlusIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                      <td className="border px-1 text-center">
                        <input
                          type="number"
                          name="amount"
                          value={
                            selectedProducts.find(
                              (p: any) => p.product === product?.product
                            )?.amount || 0
                          }
                          onChange={(e) =>
                            handleRefundAmountChange(
                              index,
                              Number(e.target.value)
                            )
                          }
                          onFocus={(e: any) => e.target.select()}
                          className="border border-red-500 px-1 py-1 w-20 font-medium rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
