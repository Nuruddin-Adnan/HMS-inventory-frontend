import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import logo from "../../public/logo.svg";
import numWords from "num-words";

export default function InvoiceLg({ order }: { order: any }) {
  const {
    BILLID,
    subtotal,
    discountAmount,
    vatAmount,
    total,
    received,
    due,
    paymentStatus,
    items,
    customer,
    payments,
    refunds,
    totalRefundAmount,
    createdBy,
    createdAt,
  } = order;

  return (
    <>
      <div className="flex flex-col px-10 sm:px-20 pt-16 pb-10 bg-white  dark:bg-neutral-800">
        <div className="flex justify-between">
          <div>

            <Image src={logo} alt="logo" className="max-w-[70px]" />
            <h1 className="mt-2 text-lg md:text-xl font-semibold text-blue-600 dark:text-white">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
          </div>

          <div className="text-end">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-neutral-200">
              Invoice #
            </h2>
            <span className="mt-1 block text-gray-700 dark:text-neutral-500 font-bold">
              ID: {BILLID}
            </span>

            <address className="mt-4 not-italic text-gray-800 dark:text-neutral-200">
              Your Shop Address
              <br />
              Road No: 13/A
              <br />
              House No: 35B
              <br />
              Dhaka, Bangladesh
              <br />
            </address>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Bill to:
            </h3>
            {customer[0]?.name && (
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                {customer[0]?.name}
              </h3>
            )}
            {customer[0]?.address && (
              <address className="mt-2 not-italic text-gray-600 dark:text-neutral-500">
                <span className="whitespace-pre-line">
                  {customer[0]?.address}
                </span>
                <br />
                {customer[0]?.contactNo}
              </address>
            )}
          </div>

          <div className="sm:text-end space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-1">
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">
                  Invoice date:
                </dt>
                <dd className="col-span-2 text-gray-500 dark:text-neutral-500">
                  {format(new Date(createdAt), "dd/MMM/yyyy p")}
                </dd>
              </dl>
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">
                  Created By:
                </dt>
                <dd className="col-span-2 text-gray-500 dark:text-neutral-500">
                  {createdBy[0]?.name}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="border border-gray-200 p-4 rounded-lg  dark:border-neutral-700">
            <div className="hidden sm:grid sm:grid-cols-6 p-2 bg-gray-200">
              <div className="sm:col-span-3 text-xs font-medium text-gray-700 uppercase dark:text-neutral-500">
                Item
              </div>
              <div className="text-start text-xs font-medium text-gray-700 uppercase dark:text-neutral-500">
                Qty
              </div>
              <div className="text-start text-xs font-medium text-gray-700 uppercase dark:text-neutral-500">
                Rate
              </div>
              <div className="text-end text-xs font-medium text-gray-700 uppercase dark:text-neutral-500">
                Amount
              </div>
            </div>

            {/* <div className="hidden sm:block border-b border-gray-200 dark:border-neutral-700"></div> */}

            {items.map((product: any, index: number) => (
              <div
                key={product?._id}
                className="grid grid-cols-3 sm:grid-cols-6 border-b py-1 px-2 border-dashed text-[13px] font-medium"
              >
                <div className="col-span-full sm:col-span-3">
                  <h5 className="sm:hidden font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Item
                  </h5>
                  <p className="text-gray-800 dark:text-neutral-200">
                    <span className="me-1">{index + 1}. </span>{" "}
                    {product?.productName[0]?.name}
                  </p>
                </div>
                <div>
                  <h5 className="sm:hidden font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Qty
                  </h5>
                  <p className="text-gray-800 dark:text-neutral-200">
                    {product?.quantity}
                  </p>
                </div>
                <div>
                  <h5 className="sm:hidden font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Rate
                  </h5>
                  <p className="text-gray-800 dark:text-neutral-200">
                    {product?.price}
                  </p>
                </div>
                <div>
                  <h5 className="sm:hidden font-medium text-gray-500 uppercase dark:text-neutral-500">
                    Amount
                  </h5>
                  <p className="sm:text-end text-gray-800 dark:text-neutral-200">
                    ৳ {product?.price * product?.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex sm:justify-between items-center">
          <div className="text-center w-full">
            <h2 className="font-bold text-3xl border-8 border-double capitalize inline-block py-2 px-4 text-gray-500">{paymentStatus.replace('-', ' ')}</h2>
          </div>
          <div className="w-full max-w-2xl sm:text-end space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 font-medium">
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 text-gray-600 dark:text-neutral-200">
                  Subtotal:
                </dt>
                <dd className="col-span-2 text-gray-800 dark:text-neutral-500">
                  ৳ {subtotal.toFixed(2)}
                </dd>
              </dl>
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 text-gray-600 dark:text-neutral-200">
                  Tax:
                </dt>
                <dd className="col-span-2 text-gray-800 dark:text-neutral-500">
                  ৳ {vatAmount.toFixed(2)}
                </dd>
              </dl>
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 text-gray-600 dark:text-neutral-200">
                  Discount:
                </dt>
                <dd className="col-span-2 text-gray-800 dark:text-neutral-500">
                  ৳ {discountAmount.toFixed(2)}
                </dd>
              </dl>

              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 text-gray-600 dark:text-neutral-200">
                  Total:
                </dt>
                <dd className="col-span-2 text-gray-800 dark:text-neutral-500">
                  ৳ {total.toFixed(2)}
                </dd>
              </dl>

              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 text-gray-600 dark:text-neutral-200">
                  Amount paid:
                </dt>
                <dd className="col-span-2 text-gray-800 dark:text-neutral-500">
                  ৳ {received.toFixed(2)}
                </dd>
              </dl>

              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 text-gray-600 dark:text-neutral-200">
                  Due balance:
                </dt>
                <dd className="col-span-2 text-gray-800 dark:text-neutral-500">
                  ৳ {due.toFixed(2)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="capitalize font-bold">Total Received <span className="ps-5">:</span> <u>Taka {numWords(parseInt(received))} Only</u></h3>
          <table className="table-auto text-sm whitespace-nowrap">
            <tbody>
              {payments &&
                payments.map((payment: any, index: number) => (
                  <tr key={payment._id}>
                    <td className="pr-2">
                      {index + 1}.{" "}
                      {payment?.createdAt &&
                        format(new Date(payment?.createdAt), "dd/MM/yyyy p")}
                    </td>
                    <td className="px-2">
                      By: {(payment?.createdBy[0]?.email).slice(0, 17)}
                      {(payment?.createdBy[0]?.email).length > 17 && "..."}
                    </td>
                    <td className="px-2">
                      Discount: {payment?.discountAmount}
                    </td>
                    <td className="px-2">
                      Amount: {payment?.amount.toFixed(2)}
                    </td>
                    <td>
                      {payment?.paymentMethod}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Thank you!
          </h4>
          <p className="text-gray-700 dark:text-neutral-500">
            If you have any questions concerning this invoice, use the following
            contact information:
          </p>
          <div className="mt-2">
            <p className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </p>
            <p className="block text-sm font-medium text-gray-800 dark:text-neutral-200">
              {process.env.NEXT_PUBLIC_APP_CONTACT_NO}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm text-gray-700 dark:text-neutral-500">
          <span className="pr-1">Powered by:</span>{" "}
          {process.env.NEXT_PUBLIC_POWERED_BY}
          <span className="pl-2 pr-1">Contact:</span>
          {process.env.NEXT_PUBLIC_POWERED_BY_CONTACT_NO}
        </p>
      </div>
    </>
  );
}
