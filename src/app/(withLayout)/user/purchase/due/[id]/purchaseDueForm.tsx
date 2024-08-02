"use client";

import { duePaymentPurchase } from "@/api-services/purchase/duePaymentPurchase";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Select from "@/components/ui/form/Select";
import convertStringToNumber from "@/helpers/convertStringToNumber";
import { removeEmptyFields } from "@/lib/removeEmptyFields";
import { paymentMethodOptions } from "@/lib/selectOptions";
import tagRevalidate from "@/lib/tagRevalidate";
import { reactSelectStyles } from "@/styles/reactSelectStyles";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactSelect from "react-select";
import CreatableSelect from "react-select/creatable";

export default function PurchaseDueForm({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(0);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      // Convert  fields as number
      const amount = (formData.get("amount") ?? "") as string;
      const amountAsNumber: number = convertStringToNumber(amount);

      const payload = {
        paymentMethod: (formData.get("paymentMethod") ?? "") as string,
        amount: amountAsNumber,
      };

      const nonEmptyPayload = removeEmptyFields(payload);
      const result = await duePaymentPurchase(data?.BILLID, nonEmptyPayload);
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
        <form onSubmit={handleSubmit} className="grid 2xl:gap-4 gap-3">
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
                  <label className="lg:flex items-center gap-4">
                    <span className="text-textPrimary font-semibold block lg:w-1/3">
                      Purchase Unit:
                    </span>
                    <div className="lg:w-2/3">
                      <CreatableSelect
                        name="unit"
                        isClearable={true}
                        styles={reactSelectStyles}
                        defaultValue={{
                          label: data?.unit,
                          value: data?.unit,
                        }}
                        isDisabled
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
                  <div className="flex space-x-4 justify-between text-base whitespace-nowrap">
                    <div className="space-y-2 w-1/3">
                      <Select
                        options={paymentMethodOptions}
                        name="paymentMethod"
                        label="Payment Method"
                        labelClassName="text-base"
                        defaultValue="cash"
                      />
                    </div>
                    <div className="grid 2xl:gap-4 gap-3 w-2/3">
                      <div className="grid  space-y-1 text-right items-center">
                        <p className="text-textPrimary font-bold">
                          Payable Amount :
                        </p>
                        <p className="text-textPrimary font-bold">
                          {data?.total} TK
                        </p>
                        <p className="text-textPrimary font-bold">
                          Previous Payment :
                        </p>
                        <p className="text-textPrimary font-bold">
                          {data?.advance} TK
                        </p>

                        <div className="border-b col-span-2"></div>

                        <p className="text-textPrimary">New Pay Amount :</p>
                        <div className="relative ml-auto w-2/3">
                          <Input
                            name="amount"
                            type="number"
                            step="0.001"
                            className={`pr-6 text-lg ${data?.due - amount < 0
                              ? "border-red-500"
                              : "border-blue-300"
                              }`}
                            required
                            onChange={(e: any) => setAmount(e.target.value)}
                          />
                          <span className="absolute top-1/2 right-2 -translate-y-1/2">
                            TK
                          </span>
                        </div>

                        <p className="text-textPrimary font-bold">
                          Due Amount :
                        </p>
                        <p
                          className={`font-bold ${data?.due - amount < 0
                            ? "text-red-500"
                            : "text-textPrimary"
                            }`}
                        >
                          {data?.due - amount}
                          TK
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-base mt-5 flex items-center justify-end">
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
                      Due Payment
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
