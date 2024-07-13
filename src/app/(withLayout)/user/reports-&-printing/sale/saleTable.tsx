"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import "core-js";
import Table from "@/components/ui/table/Table";
import { GroupByHelper } from "@/helpers/groupByHelper";

const pageStyle = `
@page{
    margin: 30px;  
}
`;

export default function SaleTable({
  sales,
  startDate,
  endDate,
}: {
  sales: any[];
  startDate: any;
  endDate: any;
}) {
  const [data, setData] = useState<any[]>(sales);
  const [createdBy, setCreatedBy] = useState<any>("All");

  // filter start
  const dataGroupByEntryBy = GroupByHelper.groupBy(
    sales,
    ({ createdBy }: { createdBy: any }) => createdBy[0]?.name
  );

  const filteredData = data.filter(
    (item: any) => createdBy === "All" || item?.createdBy[0]?.name === createdBy
  );
  // filter end

  const columns = [
    {
      key: "createdAt",
      label: "Entry",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {format(new Date(row?.createdAt), "dd/MMM/yyyy p")}
          </span>
        );
      },
    },
    { key: "BILLID", label: "Invoice" },
    {
      key: "customer",
      label: "Customer",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {row?.customer[0]?.contactNo}
          </span>
        );
      },
    },
    {
      key: "subtotal",
      label: "Subtotal",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">{row?.subtotal}</div>
      ),
    },
    {
      key: "discountPercent",
      label: "Discount%",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">
          {row?.discountPercent}
        </div>
      ),
    },
    {
      key: "vatPercent",
      label: "Vat%",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">
          {row?.vatPercent}
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">{row?.total}</div>
      ),
    },
    {
      key: "received",
      label: "Received",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">{row?.received}</div>
      ),
    },
    {
      key: "due",
      label: "Due",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">{row?.due}</div>
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
              <h3 className="font-bold text-textPrimary">Sales By:</h3>
            </div>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${
                createdBy === "All"
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
              }`}
              onClick={() => setCreatedBy("All")}
            >
              All
            </button>
            {Object.entries(dataGroupByEntryBy).map(([key, value]) => (
              <button
                className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap capitalize ${
                  createdBy === key
                    ? "bg-primary bg-opacity-10 text-primary"
                    : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
                key={key}
                onClick={() => setCreatedBy(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 pb-6 w-full card">
          {/* Table component */}
          <Table
            title="Sales Report"
            caption={
              <div className="pt-3">
                <h2 className="hidden print:block text-black text-xl font-bold underline">
                  Sales Report
                </h2>
                <p className="text-black">
                  Date From {formatedStartDate} To {formatedEndDate}
                </p>
                <h3 className="test-base font-bold text-black mb-2 print:mb-0 pt-2 px-2 print:border-gray-600 border-b-4 border-double capitalize flex justify-between">
                  <span>{`Sale By: ${createdBy}`}</span>
                </h3>
              </div>
            }
            columns={columns}
            data={filteredData}
            uniqueKey="_id"
            customTfClass="text-right whitespace-nowrap print:font-medium"
            customTdClass="py-0.5 align-top"
            responsive
            search
            sort
            print
            pageStyle={pageStyle}
            sumFields={["total", "received", "due"]}
          />
        </div>
      </div>
    </div>
  );
}
