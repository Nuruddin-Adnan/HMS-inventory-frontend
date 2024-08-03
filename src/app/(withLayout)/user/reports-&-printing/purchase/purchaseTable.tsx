"use client";

import React, {  useState } from "react";
import { format } from "date-fns";
import "core-js";
import Table from "@/components/ui/table/Table";
import { GroupByHelper } from "@/helpers/groupByHelper";
import Link from "next/link";

const pageStyle = `
@page{
    margin: 30px;  
}
`;

export default function PurchaseTable({
  purchases,
  startDate,
  endDate,
  totalPages,
  limit,
}: {
  purchases: any[];
  startDate: any;
  endDate: any;
  totalPages: number;
  limit: number;
}) {
  const [heading, setHeading] = useState<any>("All");
  const [createdBy, setCreatedBy] = useState<any>("All");
  const [supplierBrand, setSupplierBrand] = useState<any>("All");
  const [paymentType, setPaymentType] = useState<any>("All");


  // filter start
  const dataGroupByEntryBy = GroupByHelper.groupBy(
    purchases,
    ({ createdBy }: { createdBy: any }) => createdBy[0]?.name
  );
  const dataGroupByBrand = GroupByHelper.groupBy(
    purchases,
    ({ supplier }: { supplier: any }) => supplier?.brandInfo[0]?.name
  );

  const filteredData = purchases.filter(
    (item: any) => createdBy === "All" || item?.createdBy[0]?.name === createdBy
  ).filter(
    (item: any) => supplierBrand === "All" || item?.supplier?.brandInfo[0]?.name === supplierBrand
  ).filter(
    (item: any) =>
      paymentType === "All" ||
      (paymentType === "due" && item?.due > 0) ||
      (paymentType === "paid" && item?.due === 0)
  )
  // filter end

  const columns = [
    {
      key: "createdAt",
      label: "Entry On",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {format(new Date(row?.createdAt), "dd/MM/yyyy p")}
          </span>
        );
      },
    },
    {
      key: "BILLID",
      label: "ID",
      render: (row: any) => (
        <Link href={`/user/purchase/update/${row.BILLID}`} className="underline text-[#000186] print:no-underline">
          {row?.BILLID}
        </Link>
      ),
    },
    {
      key: "productName",
      label: "Product Name",
      render: (row: any) => (
        <div className="whitespace-nowrap">
          {row?.productName} <br />
          Code: {row?.product[0]?.code}
        </div>
      ),
    },
    {
      key: "supplier",
      label: "Supplier",
      render: (row: any) => (
        <div className="whitespace-nowrap">
          <span className="block">
            {" "}
            {row?.supplier?.name} ({row?.supplier?.contactNo})
          </span>
          <span className="block">{row?.supplier?.brandInfo[0]?.name}</span>
        </div>
      ),
    },
    { key: "invoiceNo", label: "Invoice No" },
    { key: "unit", label: "Unit" },
    {
      key: "price",
      label: "Price",
      customClass: "text-right w-24 ",
      render: (row: any) => (
        <div className="text-right font-medium ">{row?.price}</div>
      ),
    },
    {
      key: "quantity",
      label: "Qty",
      customClass: "text-right w-24 ",
      render: (row: any) => (
        <div className="text-right font-medium ">{row?.quantity}</div>
      ),
    },
    {
      key: "refundQuantity",
      label: "Rf/Qty",
      customClass: "text-right w-24 ",
      render: (row: any) => (
        <div className="text-right font-medium ">{row?.refundQuantity}</div>
      ),
    },
    {
      key: "total",
      label: "Total",
      customClass: "text-right w-24 ",
      render: (row: any) => (
        <div className="text-right font-medium">{row?.total}</div>
      ),
    },
    {
      key: "advance",
      label: "Advance",
      customClass: "text-right w-24",
      render: (row: any) => (
        <div className="text-right font-medium ">{row?.advance}</div>
      ),
    },
    {
      key: "due",
      label: "Due",
      customClass: "text-right w-24",
      render: (row: any) => (
        <div className="text-right font-medium ">{row?.due}</div>
      ),
    },
  ];

  const formatedStartDate = format(new Date(startDate), "dd-MMM-yyyy p");
  const formatedEndDate = format(new Date(endDate), "dd-MMM-yyyy p");

  return (
    <div>
      <div className="flex gap-5 lg:flex-row flex-col">
        <div className="lg:w-96 w-full">
          <div className="sticky 2xl:top-[70px] top-[60px] p-4 card max-h-[85vh] overflow-auto">

            <div className="flex justify-between items-center border-b border-gray-500 mb-2 pb-1">
              <h3 className="font-bold text-textPrimary">Purchase By:</h3>
            </div>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${createdBy === "All"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => setCreatedBy("All")}
            >
              All
            </button>
            {Object.entries(dataGroupByEntryBy).map(([key, value]) => (
              <button
                className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap capitalize ${createdBy === key
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                  }`}
                key={key}
                onClick={() => setCreatedBy(key)}
              >
                {key}
              </button>
            ))}

            <div className="flex justify-between items-center border-b border-gray-500 mb-2 pt-3">
              <h3 className="font-bold text-textPrimary">Supplier Brand:</h3>
            </div>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${supplierBrand === "All"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => setSupplierBrand("All")}
            >
              All
            </button>
            {Object.entries(dataGroupByBrand).map(([key, value]) => (
              <button
                className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap capitalize ${supplierBrand === key
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                  }`}
                key={key}
                onClick={() => setSupplierBrand(key)}
              >
                {key}
              </button>
            ))}

            {/* Filter by payment type */}
            <h3 className="font-bold text-textPrimary pt-3 mb-2 border-b border-gray-500">
              Payment Type
            </h3>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${paymentType === "All"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => {
                setPaymentType("All"),
                  setHeading("All");
              }}
            >
              All
            </button>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${paymentType === "paid"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => {
                setPaymentType("paid"),
                  setHeading("Paid");
              }}
            >
              Paid
            </button>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${paymentType === "due"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => {
                setPaymentType("due"),
                  setHeading("Due");
              }}
            >
              Due
            </button>

          </div>
        </div>
        <div className="px-4 pb-6 w-full card">
          {/* Table component */}
          <Table
            title="Purchase Report"
            caption={
              <div>
                <h1 className="hidden print:block pt-3 text-black text-2xl font-bold">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </h1>
                <h2 className="hidden print:block text-black text-xl font-bold underline">
                  Purchase Report
                </h2>
                <p className="text-black">
                  Date From {formatedStartDate} To {formatedEndDate}
                </p>
                <h3 className="test-base font-bold text-black mb-2 print:mb-0 pt-2 px-2 print:border-gray-600 border-b-4 border-double capitalize flex justify-between">
                  <span>{`Purchase By: ${createdBy}`}</span>
                  <span>{`Brand: ${supplierBrand}`}</span>
                  <span>{`Payment Type: ${heading}`}</span>
                </h3>
              </div>
            }
            columns={columns}
            data={filteredData}
            uniqueKey="_id"
            customThClass="whitespace-nowrap"
            customTdClass="py-0.5 align-top"
            customTfClass="text-right whitespace-nowrap print:font-medium"
            responsive
            search
            sort
            print
            pageStyle={pageStyle}
            sumFields={["total", "advance", "due"]}
            backBtn
            tableHeightClass="h-[calc(100vh-180px)]"
            pagination
            totalPages={totalPages}
            limit={limit}
          />
        </div>
      </div>

    </div>
  );
}
