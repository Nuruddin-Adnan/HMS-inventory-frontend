"use client";

import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import "core-js";
import Table from "@/components/ui/table/Table";
import { GroupByHelper } from "@/helpers/groupByHelper";
import { useReactToPrint } from "react-to-print";
import Invoice from "@/components/Invoice";
import Link from "next/link";

const pageStyle = `
@page{
    margin: 30px;  
}
`;

export default function StockAdjustmentTable({
  stockAdjusments,
  startDate,
  endDate,
  totalPages,
  limit,
}: {
  stockAdjusments: any[];
  startDate: any;
  endDate: any;
  totalPages: number;
  limit: number;
}) {
  const [createdBy, setCreatedBy] = useState<any>("All");
  const [causes, setCauses] = useState<any>("All");




  // filter start
  const dataGroupByEntryBy = GroupByHelper.groupBy(
    stockAdjusments,
    ({ createdBy }: { createdBy: any }) => createdBy?.name
  );
  const dataGroupByCauses = GroupByHelper.groupBy(
    stockAdjusments,
    ({ causes }: { causes: any }) => causes
  );

  const filteredData = stockAdjusments.filter(
    (item: any) => createdBy === "All" || item?.createdBy?.name === createdBy
  ).filter(
    (item: any) => causes === "All" || item?.causes === causes
  )
  // filter end

  const columns = [
    { key: "productName", label: "Product Name" },
    {
      key: "brand", label: "Brand", render: (row: any) => <div>{row?.product?.brand}</div>,
    },
    {
      key: "unit",
      label: "Unit",
    },
    {
      key: "price",
      label: "Unit Price",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.price}
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Qty",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.quantity}</div>
      ),
    },
    {
      key: "causes",
      label: "Causes",
      customClass: "pl-5",
      render: (row: any) => <div className="capitalize pl-4">{row?.causes}</div>,
    },
    {
      key: "createdAt",
      label: "Entry On",
      customClass: "pl-8",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {format(new Date(row?.createdAt), "dd/MM/yyyy p")}
          </span>
        );
      },
    },
    {
      key: "updatedAt",
      label: "Edited",
      render: (row: any) => {
        return <span className="whitespace-nowrap">
          {row.updatedBy && format(new Date(row?.updatedAt), 'dd/MMM/yyyy p')}
          <br />
          {row.updatedBy && <span> By: {row.updatedBy?.name}</span>}
        </span>
      }
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
              <h3 className="font-bold text-textPrimary">Created By:</h3>
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

            <div className="flex justify-between items-center border-b border-gray-500 mb-2 mt-3 pb-1">
              <h3 className="font-bold text-textPrimary">Causes:</h3>
            </div>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${createdBy === "All"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => setCauses("All")}
            >
              All
            </button>
            {Object.entries(dataGroupByCauses).map(([key, value]) => (
              <button
                className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap capitalize ${causes === key
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                  }`}
                key={key}
                onClick={() => setCauses(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 pb-6 w-full card">
          {/* Table component */}
          <Table
            title="Damage/Expire Report"
            caption={
              <div>
                <h1 className="hidden print:block pt-3 text-black text-2xl font-bold">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </h1>
                <h2 className="hidden print:block text-black text-xl font-bold underline">
                  Damage/Expire Report
                </h2>
                <p className="text-black">
                  Date From {formatedStartDate} To {formatedEndDate}
                </p>
                <h3 className="test-base font-bold text-black mb-2 print:mb-0 pt-2 px-2 print:border-gray-600 border-b-4 border-double capitalize flex justify-between">
                  <span>{`Created By: ${createdBy}`}</span>
                  <span>{`Causes: ${causes}`}</span>
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
