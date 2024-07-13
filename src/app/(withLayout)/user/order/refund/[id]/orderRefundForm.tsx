"use client";

import { orderRefund } from "@/api-services/order/orderRefund";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import calculatePercentageToAmount from "@/helpers/calculatePercentageToAmount";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { sumArrayField } from "@/helpers/sumArrayField";
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
  const [checkedItems, setCheckedItems] = useState<any>({});

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

  const sumCurrentRefundAmount = sumArrayField(selectedProducts, "amount");

  // calculate single product refund amout. Add vat amount and subtract discount amount
  const amountAfterDiscoutAndVat = (amount: number) => {
    const vatAmount = calculatePercentageToAmount(vatPercent, amount);
    const discountAmount = calculatePercentageToAmount(discountPercent, amount);

    return amount + vatAmount - discountAmount;
  };

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
        amount: amountAfterDiscoutAndVat(Math.max(amount, 0) * product.price),
      });
    } else {
      updatedProducts[existingProductIndex].quantity = Math.max(
        updatedProducts[existingProductIndex].quantity + amount,
        0
      );
      updatedProducts[existingProductIndex].amount = amountAfterDiscoutAndVat(
        updatedProducts[existingProductIndex].quantity * product.price
      );

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
    } else {
      updatedProducts[existingProductIndex].amount = Math.max(amount, 0);
    }

    setSelectedProducts(updatedProducts);
  };

  const handleCheckboxChange = (index: number) => {
    const updatedCheckedItems = { ...checkedItems };
    const product = items[index];

    if (updatedCheckedItems[product?.product]) {
      delete updatedCheckedItems[product?.product];
    } else {
      updatedCheckedItems[product?.product] = true;
    }

    setCheckedItems(updatedCheckedItems);

    // If unchecking, remove the product from selectedProducts
    if (!updatedCheckedItems[product?.product]) {
      setSelectedProducts((prev: any) =>
        prev.filter((p: any) => p.product !== product?.product)
      );
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      const payload = {
        items: selectedProducts,
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
                <thead className="text-nowrap">
                  <tr>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      <input type="checkbox" disabled />
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Product
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Qty
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      RF/Qty
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Unit
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Price
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Vat%
                    </th>
                    <th className="py-2 px-4 border sticky top-0 bg-gray-300">
                      Disc%
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
                    <tr
                      key={index}
                      className={`${
                        product?.quantity === product?.refundQuantity
                          ? "bg-red-500 bg-opacity-20 text-red-700"
                          : product?.refundQuantity > 0
                          ? "bg-yellow-500 bg-opacity-20 text-yellow-700"
                          : ""
                      }`}
                    >
                      <td className="py-1 px-4 border text-center">
                        <input
                          type="checkbox"
                          checked={checkedItems[product?.product] || false}
                          onChange={() => handleCheckboxChange(index)}
                          disabled={
                            product?.quantity === product?.refundQuantity
                              ? true
                              : false
                          }
                        />
                      </td>
                      <td className="py-1 px-4 border">
                        {product?.productName[0]?.name}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {product?.quantity}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {product?.refundQuantity}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {product?.unit}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {product?.price}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {vatPercent}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {discountPercent}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {toFixedIfNecessary(
                          amountAfterDiscoutAndVat(
                            product?.price * product?.quantity
                          ),
                          2
                        )}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {checkedItems[product?.product] && (
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
                                  (p: any) => p.product === product.product
                                )?.quantity || 0
                              }
                              onChange={(e) =>
                                handleQuantityChange(
                                  index,
                                  Number(e.target.value) -
                                    (selectedProducts.find(
                                      (p: any) => p.product === product.product
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
                        )}
                      </td>
                      <td className="py-1 px-4 border text-center">
                        {checkedItems[product?.product] && (
                          <input
                            type="number"
                            name="amount"
                            value={
                              selectedProducts.find(
                                (p: any) => p.product === product.product
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
                        )}
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
            <h2 className="text-lg font-bold bg-rose-500 bg-opacity-20 text-rose-700 py-1 px-4 rounded mt-2 grid grid-cols-5">
              <span className="col-span-2">Previous Refund </span>{" "}
              <span>:</span>{" "}
              <span className="col-span-2">
                {toFixedIfNecessary(totalRefundAmount, 2)} TK
              </span>
            </h2>
            <h2 className="text-lg font-bold bg-red-500 bg-opacity-30  text-red-700 py-1 px-4 rounded mt-2 mb-5 grid grid-cols-5">
              <span className="col-span-2">Current Refund </span> <span>:</span>{" "}
              <span className="col-span-2">
                {toFixedIfNecessary(sumCurrentRefundAmount, 2)} TK
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
              <button
                type="submit"
                className="bg-red-500 text-white py-2 px-4 rounded w-full font-semibold disabled:bg-opacity-60 disabled:cursor-not-allowed"
                disabled={selectedProducts.length > 0 ? false : true}
              >
                Refund
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
