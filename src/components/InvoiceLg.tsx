import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import logo from "../../public/logo.svg";
import numWords from "num-words";
import { toFixedIfNecessary } from "@/helpers/toFixedIfNecessary";

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
    refundTotal,
    refundAmount,
    createdBy,
    createdAt,
  } = order;

  return (
    <>
      <div className="flex flex-col px-5 sm:px-20 pt-16 pb-10 bg-white  dark:bg-neutral-800 text-[13px]">
        <div className="flex justify-between">
          <div>
            <Image src={logo} alt="logo" className="max-w-[70px]" />
            <h1 className="mt-2 text-lg md:text-xl font-semibold text-blue-600 dark:text-white">
              Medinova Pharmacy
            </h1>

            <div className="mt-5">
              <h3 className="text-lg font-semibold black">Bill to:</h3>
              {customer[0]?.name && (
                <h3 className="text-base font-semibold black">
                  {customer[0]?.name}
                </h3>
              )}
              {customer[0]?.address && (
                <address className="mt-1 not-italic black">
                  <span className="whitespace-pre-line">
                    {customer[0]?.address}
                  </span>
                </address>
              )}
              {customer[0]?.contactNo && (
                <span className="block black">
                  Contact: {customer[0]?.contactNo}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-end">
              <h2 className="text-2xl md:text-3xl font-semibold black">
                Invoice #
              </h2>
              <span className="mt-1 block black font-bold">ID: {BILLID}</span>

              <address className="my-3 not-italic black">
                Your Shop Address
                <br />
                Road No: 13/A, House No: 35B
                <br />
                Dhaka, Bangladesh
                <br />
                <span className="font-medium">
                  {" "}
                  Contact No: {process.env.NEXT_PUBLIC_APP_CONTACT_NO}
                </span>
              </address>
            </div>

            <div className="sm:text-end space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-1">
                <dl className="grid sm:grid-cols-4 gap-x-3">
                  <dt className="col-span-2 font-semibold black">
                    Invoice date:
                  </dt>
                  <dd className="col-span-2 black whitespace-nowrap">
                    {format(new Date(createdAt), "dd/MMM/yyyy p")}
                  </dd>
                </dl>
                <dl className="grid sm:grid-cols-4 gap-x-3">
                  <dt className="col-span-2 font-semibold black">
                    Created By:
                  </dt>
                  <dd className="col-span-2 black">{createdBy[0]?.name}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <h3 className="text-lg font-semibold black">Bill to:</h3>
            {customer[0]?.name && (
              <h3 className="text-lg font-semibold black">
                {customer[0]?.name}
              </h3>
            )}
            {customer[0]?.address && (
              <address className="mt-2 not-italic black">
                <span className="whitespace-pre-line">
                  {customer[0]?.address}
                </span>
                <br />
                {customer[0]?.contactNo}
              </address>
            )}
          </div>
        </div> */}

        <div className="mt-2">
          <div className="border border-gray-300 p-3 rounded-lg ">
            <div className="hidden sm:grid sm:grid-cols-7 p-2 bg-gray-200">
              <div className="sm:col-span-3 text-xs font-medium black uppercase">
                Item
              </div>
              <div className="text-end text-xs font-medium black uppercase">
                Qty
              </div>
              <div className="text-end text-xs font-medium black uppercase">
                Rate
              </div>
              <div className="text-end text-xs font-medium black uppercase">
                Discount%
              </div>
              <div className="text-end text-xs font-medium black uppercase">
                Amount
              </div>
            </div>

            {items.map((product: any, index: number) => (
              <div
                key={product?._id}
                className="grid grid-cols-4 sm:grid-cols-7 border-b border-b-gray-300 border-dashed py-0.5 px-1 text-[13px] font-medium"
              >
                <div className="col-span-full sm:col-span-3">
                  <h5 className="sm:hidden font-medium black uppercase">
                    Item
                  </h5>
                  <p className="black">
                    <span className="me-1">{index + 1}. </span>{" "}
                    {product?.productDetails[0]?.name}
                  </p>
                </div>
                <div className="sm:text-end">
                  <h5 className="sm:hidden font-medium black uppercase ">
                    Qty
                  </h5>
                  <p className="black">{product?.quantity}</p>
                </div>
                <div className="sm:text-end">
                  <h5 className="sm:hidden font-medium black uppercase">
                    Rate
                  </h5>
                  <p className="black">{product?.price}</p>
                </div>
                <div className="sm:text-end">
                  <h5 className="sm:hidden font-medium black uppercase">
                    Discount%
                  </h5>
                  <p className="black">
                    {product?.discountPercent?.toFixed(2)}
                  </p>
                </div>
                <div className="text-end">
                  <h5 className="sm:hidden font-medium black uppercase">
                    Amount
                  </h5>
                  <p className="sm:text-end black">৳ {product?.total}</p>
                </div>
              </div>
            ))}
          </div>

          {refunds && refunds.length > 0 && (
            <fieldset className="mt-5 p-3 pt-2 border border-gray-300 rounded-lg">
              <legend className="font-bold text-sm">Refund:</legend>
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 text-xs font-medium black uppercase text-start">
                      Refund Date
                    </th>
                    <th className="p-2 text-xs font-medium black uppercase text-start">
                      Refund Item
                    </th>
                    <th className="p-2 text-xs font-medium black uppercase text-end">
                      Qty
                    </th>
                    <th className="p-2 text-xs font-medium black uppercase text-end">
                      Price
                    </th>
                    <th className="p-2 text-xs font-medium black uppercase text-end">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((item: any, index: number) => (
                    <tr
                      key={item._id}
                      className="border-b border-b-gray-300 border-dashed font-medium text-[13px]"
                    >
                      <td className="py-0.5 px-1">
                        {format(new Date(item?.createdAt), "dd/MMM/yyyy p")}
                      </td>
                      <td className="py-0.5 px-1">
                        {item?.productDetails[0]?.name}
                      </td>
                      <td className="py-0.5 px-1 text-end">{item?.quantity}</td>
                      <td className="py-0.5 px-1 text-end">
                        {toFixedIfNecessary(item?.total, 2)}
                      </td>
                      <td className="py-0.5 px-1 text-end">
                        {toFixedIfNecessary(item?.amount, 2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </fieldset>
          )}
        </div>

        <div className="mt-4 flex sm:flex-row flex-col sm:justify-between items-center">
          <div className="text-center md:w-full">
            <h2 className="font-bold md:text-2xl text-lg whitespace-nowrap border-8 border-gray-700 border-double capitalize inline-block py-2 px-4 text-gray-700">
              {paymentStatus.replace("-", " ")}
            </h2>
          </div>
          <div className="w-full max-w-2xl sm:text-end space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-1 font-medium">
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 black">Subtotal:</dt>
                <dd className="col-span-2 black">৳ {subtotal?.toFixed(2)}</dd>
              </dl>
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 black">Vat:</dt>
                <dd className="col-span-2 black">৳ {vatAmount?.toFixed(2)}</dd>
              </dl>
              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 black">Less:</dt>
                <dd className="col-span-2 black">
                  ৳ {discountAmount?.toFixed(2)}
                </dd>
              </dl>

              <dl className="grid sm:grid-cols-5 gap-x-3 font-semibold">
                <dt className="col-span-3 black">Payable:</dt>
                <dd className="col-span-2 black">৳ {total?.toFixed(2)}</dd>
              </dl>

              {refunds && refunds.length > 0 && (
                <>
                  <dl className="grid sm:grid-cols-5 gap-x-3">
                    <dt className="col-span-3 black">Refund Total:</dt>
                    <dd className="col-span-2 black">
                      ৳ {refundTotal?.toFixed(2)}
                    </dd>
                  </dl>
                  <dl className="grid sm:grid-cols-5 gap-x-3 border-t border-t-gray-500 font-semibold">
                    <dt className="col-span-3 black">Net Payable:</dt>
                    <dd className="col-span-2 black">
                      ৳{" "}
                      {(total?.toFixed(2) - refundTotal?.toFixed(2)).toFixed(2)}
                    </dd>
                  </dl>
                </>
              )}

              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 black">Amount paid:</dt>
                <dd className="col-span-2 black">৳ {received?.toFixed(2)}</dd>
              </dl>

              {refunds && refunds.length > 0 && (
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 black">Amount Refund:</dt>
                  <dd className="col-span-2 black">
                    ৳ {refundAmount?.toFixed(2)}
                  </dd>
                </dl>
              )}

              <dl className="grid sm:grid-cols-5 gap-x-3">
                <dt className="col-span-3 black">Due balance:</dt>
                <dd className="col-span-2 black">৳ {due?.toFixed(2)}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="capitalize font-bold">
            Total Received <span className="ps-5">:</span>{" "}
            <u>Taka {numWords(parseInt(received))} Only</u>
          </h3>
          <div className="w-full overflow-x-auto">
            <table className="table-auto text-sm print:text-xs whitespace-nowrap">
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
                        Amount: {payment?.amount?.toFixed(2)}
                      </td>
                      <td>{payment?.paymentMethod}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {refunds && refunds.length > 0 && (
          <h3 className="capitalize font-bold mt-4">
            Total Refund <span className="ps-5">:</span>{" "}
            <u>Taka {numWords(parseInt(refundAmount))} Only</u>
          </h3>
        )}

        <div className="mt-8">
          <h4 className="text-lg font-semibold black">Thank you!</h4>
          <p className="black">
            If you have any questions concerning this invoice, use the following
            contact information:
          </p>
        </div>

        <p className="mt-5 black">
          <span className="pr-1">Powered by:</span>{" "}
          medisoftit.com
          <span className="pl-2 pr-1">Contact:</span>
          {"01300635567"}
        </p>
      </div>
    </>
  );
}
