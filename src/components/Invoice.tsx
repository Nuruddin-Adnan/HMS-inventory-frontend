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
    refundTotal,
    refundAmount,
    items,
    customer,
    payments,
    refunds,
    createdBy,
    createdAt,
  } = order;

  return (
    <div className="max-w-[80mm] mx-auto px-3 py-8 bg-white invoice-sm">
      <header>
        <div className="text-center text-[13px]">
          <h1 className="font-bold text-lg">
            Medinova Pharmacy
          </h1>
          <address className="not-italic font-bold">
            236/1/A, Soth Pirerbag, Mirpur, Dhaka 1216 <br />
            Phone: {process.env.NEXT_PUBLIC_APP_CONTACT_NO}
          </address>
          <p>VAT Reg No # 001092713</p>
          <h3 className="font-bold pt-1 pb-0.5">Sales Invoice: {BILLID}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p> Date: {format(new Date(createdAt), "dd/MMM/yyyy")}</p>
            <p>Customer ID: {customer[0]?.CUSID}</p>
          </div>
          <div>
            <p>Time: {format(new Date(createdAt), "p")}</p>
            <p className="text-nowrap">Served By: {createdBy[0]?.name}</p>
          </div>
        </div>
        <p className="text-xs">Customer Name: {customer[0]?.name}</p>
      </header>
      <section className="mt-0.5 mb-3">
        <table className="w-full text-left text-xs align-top text-black">
          <thead className="border border-black">
            <tr>
              <th className=" ps-1">
                <div className="w-[25mm]">Items</div>
              </th>
              <th className=" px-1 text-right">
                <div>Qty</div>
              </th>
              <th className=" px-1 text-right">
                <div>Price</div>
              </th>
              <th className=" px-1 text-right">
                <div className="w-8">Disc%</div>
              </th>
              <th className=" px-1 text-right">
                <div>Total</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((product: any, index: number) => (
              <>
                <tr key={product?._id}>
                  <td colSpan={5} className="pt-0.5">
                    <div className="leading-none">
                      <strong className="pe-1">{index + 1}.</strong>
                      {product?.productDetails[0]?.name}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-b-black border-dashed">
                  <td className="leading-none break-all">
                    {product?.productDetails[0]?.code}
                  </td>
                  <td className="text-right px-2">{product?.quantity}</td>
                  <td className="text-right  px-2">{product?.price}</td>
                  <td className="text-right  px-2">
                    {product?.discountPercent?.toFixed(2)}
                  </td>
                  <td className="text-right  ps-2">
                    {product?.total?.toFixed(2)}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
          <tfoot className="border-t border-t-black text-xs">
            <tr>
              <th colSpan={3}>Total Tk:</th>
              <th colSpan={2} className="text-end">
                {subtotal.toFixed(2)}
              </th>
            </tr>
            <tr>
              <td colSpan={3}>VAT:</td>
              <td colSpan={2} className="text-end">
                {vatAmount.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={3}>Less:</td>
              <td colSpan={2} className="text-end">
                {discountAmount.toFixed(2)}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Net Amount:</th>
              <th colSpan={2} className="text-end border border-black pe-0.5">
                {total.toFixed(2)}
              </th>
            </tr>
            {refundTotal > 0 && (
              <tr>
                <th colSpan={3}>Net Refund:</th>
                <th colSpan={2} className="text-end border border-black pe-0.5">
                  {refundTotal.toFixed(2)}
                </th>
              </tr>
            )}
            <tr>
              <td colSpan={3}>Pay type:</td>
              <td colSpan={2} className="text-end">
                {payments.length > 0 && payments[0]?.paymentMethod}
              </td>
            </tr>
            <tr>
              <th colSpan={3} className="border-t border-t-black">
                Paid Amount:
              </th>
              <th colSpan={2} className="text-end border-t border-t-black">
                {received?.toFixed(2)}
              </th>
            </tr>
            {refundTotal > 0 && (
              <tr>
                <th colSpan={3}>Refund Amount:</th>
                <th colSpan={2} className="text-end">
                  {refundAmount?.toFixed(2)}
                </th>
              </tr>
            )}
            {due > 0 && (
              <tr>
                <th colSpan={3} className="border-t border-t-black">
                  Due:
                </th>
                <th colSpan={2} className="text-end border-t border-t-black">
                  {due.toFixed(2)}
                </th>
              </tr>
            )}
          </tfoot>
        </table>
      </section>

      {refunds && refunds.length > 0 && (
        <section className="pb-2">
          <h3 className="font-bold text-sm">Refund Items:</h3>
          <table className="table-auto w-full text-xs">
            <thead>
              <tr className="border border-black">
                <th className="text-start px-1">Item</th>
                <th className="px-1">Qty</th>
                <th className="text-end px-1">Date</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((item: any, index: number) => (
                <tr key={item?._id}>
                  <td>
                    <div className="leading-none">
                      <strong className="pe-1">{index + 1}.</strong>
                      {item?.productDetails[0]?.name}
                    </div>
                  </td>
                  <td className="text-center align-top">{item?.quantity}</td>
                  <td className="text-end text-nowrap align-top">
                    {format(new Date(item?.createdAt), "dd/MM/yyyy p")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <footer className="mt-2">
        <ul className="font-normal text-xs pl-2">
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
        <h4 className="text-center leading-tight mt-4 text-xs font-bold p-1 border border-black">
          Thank you for shoping at Medinova Pharmacy
        </h4>
        <p className="mt-1 block text-center font-medium text-xs">
          System by: medisoftit.com{" "}
          {"01300635567"}
        </p>
      </footer>
    </div>
  );
}
