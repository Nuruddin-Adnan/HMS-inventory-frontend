import { paymentMethodOptions } from "@/lib/selectOptions";
import { format } from "date-fns";
import React from "react";

export default function Invoice({ order }: { order: any }) {
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
    <div className="max-w-[88mm] mx-auto p-5 pt-10 bg-white invoice-sm">
      <header>
        <div className="text-center text-sm">
          <h1 className="font-bold text-xl">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <address className="not-italic font-bold">
            236/1/A, Soth Pirerbag, Mirpur, Dhaka 1216 <br />
            Phone: {process.env.NEXT_PUBLIC_APP_CONTACT_NO}
          </address>
          <p>VAT Reg No # 001092713</p>
          <h3 className="font-bold py-2">Sales Invoice: {BILLID}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p> Data: {format(new Date(createdAt), "dd/MMM/yyyy")}</p>
            <p>Customer ID: {customer[0]?.CUSID}</p>
          </div>
          <div>
            <p>Time: {format(new Date(createdAt), "p")}</p>
            <p className="text-nowrap">Served By: {createdBy[0]?.name}</p>
          </div>
        </div>
        <p className="text-xs">Customer: {customer[0]?.name}</p>
      </header>
      <section className="mt-4">
        <table className="w-full text-left mb-8 text-[13px] align-top text-gray-800">
          <thead className="border border-gray-600">
            <tr>
              <th className="py-0.5 px-1">Items</th>
              <th className="py-0.5 px-1 text-right ">
                <div className="w-8">Qty</div>
              </th>
              <th className="py-0.5 px-1 text-right ">
                <div className="w-10">Price</div>
              </th>
              <th className="py-0.5 px-1 text-right ">
                <div className="w-12">Total</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((product: any, index: number) => (
              <tr key={product?._id}>
                <td className="py-1">
                  <strong className="pe-1">{index + 1}.</strong>
                  {product?.productName[0]?.name}
                </td>
                <td className="text-right py-1 px-2">{product?.quantity}</td>
                <td className="text-right py-1 px-2">{product?.price}</td>
                <td className="text-right py-1 ps-2">
                  {(product?.price * product?.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-t-gray-500">
            <tr>
              <th colSpan={2}>Total:</th>
              <th colSpan={2} className="text-end">
                {subtotal.toFixed(2)}
              </th>
            </tr>
            <tr>
              <td colSpan={2}>VAT:</td>
              <td colSpan={2} className="text-end">
                {vatAmount.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={2}>Discount:</td>
              <td colSpan={2} className="text-end">
                {discountAmount.toFixed(2)}
              </td>
            </tr>
            <tr>
              <th colSpan={2}>Net Amount:</th>
              <th
                colSpan={2}
                className="text-end border border-gray-500 pe-0.5"
              >
                {total.toFixed(2)}
              </th>
            </tr>
            <tr>
              <td colSpan={2}>Pay type:</td>
              <td colSpan={2} className="text-end">
                {payments.length > 0 && payments[0].paymentMethod}
              </td>
            </tr>
            <tr>
              <th colSpan={2} className="border-t border-t-gray-500">
                Paid Amount:
              </th>
              <th colSpan={2} className="text-end border-t border-t-gray-500">
                {received.toFixed(2)}
              </th>
            </tr>
            {due > 0 && (
              <tr>
                <th colSpan={2} className="border-t border-t-gray-500">
                  Due:
                </th>
                <th colSpan={2} className="text-end border-t border-t-gray-500">
                  {due.toFixed(2)}
                </th>
              </tr>
            )}
          </tfoot>
        </table>
      </section>

      <footer className="px-3">
        <ul className="font-normal text-[13px]">
          <li className="flex gap-1">
            <span>১.</span>{" "}
            <span>ক্রয় কৃত পণ্য ৭ দিন পর পরিবর্তন যোগ্য নয় ।</span>{" "}
          </li>
          <li className="flex gap-1">
            <span>২.</span>{" "}
            <span>৭ দিনের মধ্যে পরিবর্তনের জন্য ক্যাশ ভাউচার আবশ্যক ।</span>
          </li>
          <li className="flex gap-1">
            <span>৩.</span> <span>ফ্রিজে সংরক্ষিত ঔষুধ পরিবর্তন যোগ্য নয়</span>
          </li>
        </ul>
        <strong className=" mt-4 block">
          System by: Medisoft IT ltd.{" "}
          {process.env.NEXT_PUBLIC_POWERED_BY_CONTACT_NO}
        </strong>
      </footer>
    </div>
  );
}
