import { getAllCustomers } from "@/api-services/customer/getAllCustomers";
import { totalStock } from "@/api-services/stock/totalStock";
import { sumArrayField } from "@/helpers/sumArrayField";
import Link from "next/link";
import React from "react";

export default async function Widget({
  orderSummaries,
  purchaseSummaries,
}: {
  orderSummaries: any;
  purchaseSummaries: any;
}) {
  const customer = await getAllCustomers('status=active&fields=""');
  const { data: stock } = await totalStock("status=active");

  function convertToK(number: number) {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toString();
  }

  const totalSale = sumArrayField(orderSummaries, "sale");
  const totalPurchase = sumArrayField(purchaseSummaries, "purchase");

  return (
    <div>
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Link
          href="/user/purchase"
          className="cursor-pointer hover:border-red-200 border-transparent border transition-all hover:shadow-lg flex md:flex-row flex-col md:gap-0 md:text-left text-center gap-4 items-center md:p-8 p-5 bg-white shadow rounded-lg"
        >
          <div className="inline-flex flex-shrink-0 items-center justify-center 2xl:h-16 2xl:w-16 h-14 w-14 text-red-600 bg-red-100 rounded-full 2xl:mr-6 md:mr-4">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
          <div>
            <span className="inline-block 2xl:text-2xl text-xl font-bold">
              {convertToK(totalPurchase)}
            </span>
            <span className="block text-gray-500">Total Purchase</span>
          </div>
        </Link>
        <Link
          href="/user/order"
          className="cursor-pointer hover:border-green-200 border-transparent border transition-all hover:shadow-lg flex md:flex-row flex-col md:gap-0 md:text-left text-center gap-4 items-center md:p-8 p-5 bg-white shadow rounded-lg"
        >
          <div className="inline-flex flex-shrink-0 items-center justify-center 2xl:h-16 2xl:w-16 h-14 w-14 text-green-600 bg-green-100 rounded-full 2xl:mr-6 md:mr-4">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div>
            <span className="block 2xl:text-2xl text-xl font-bold">
              {convertToK(totalSale)}
            </span>
            <span className="block text-gray-500">Total Sales</span>
          </div>
        </Link>
        <Link
          href="/user/stock"
          className="cursor-pointer hover:border-blue-200 border-transparent border transition-all hover:shadow-lg flex md:flex-row flex-col md:gap-0 md:text-left text-center gap-4 items-center md:p-8 p-5 bg-white shadow rounded-lg"
        >
          <div className="inline-flex flex-shrink-0 items-center justify-center 2xl:h-16 2xl:w-16 h-14 w-14 text-blue-600 bg-blue-100 rounded-full 2xl:mr-6 md:mr-4">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7l9-4 9 4-9 4-9-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7v10l9 4 9-4V7M3 17l9 4 9-4"
              />
            </svg>
          </div>
          <div>
            <span className="inline-block 2xl:text-2xl text-xl font-bold">
              {convertToK(stock.totalPrice)}
            </span>
            <span className="inline-block 2xl:text-xl text-lg text-gray-500 font-semibold">
              ({stock.totalStockItems} Items)
            </span>
            <span className="block text-gray-500">Stocked Product</span>
          </div>
        </Link>
        <Link
          href="/user/customer"
          className="cursor-pointer hover:border-orange-200 border-transparent border transition-all hover:shadow-lg flex md:flex-row flex-col md:gap-0 md:text-left text-center gap-4 items-center md:p-8 p-5 bg-white shadow rounded-lg"
        >
          <div className="inline-flex flex-shrink-0 items-center justify-center 2xl:h-16 2xl:w-16 h-14 w-14 text-orange-600 bg-orange-100 rounded-full 2xl:mr-6 md:mr-4">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <span className="block 2xl:text-2xl text-xl font-bold">
              {convertToK(customer?.meta?.total ?? 0)}
            </span>
            <span className="block text-gray-500">Total Customer</span>
          </div>
        </Link>
      </section>
    </div>
  );
}
