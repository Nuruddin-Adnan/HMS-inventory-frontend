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

export default function ExpenseTable({
  expenses,
  startDate,
  endDate,
}: {
  expenses: any[];
  startDate: any;
  endDate: any;
}) {
  const [data, setData] = useState<any[]>(expenses);
  const [createdBy, setCreatedBy] = useState<any>("All");

  // filter start
  const dataGroupByEntryBy = GroupByHelper.groupBy(
    expenses,
    ({ createdBy }: { createdBy: any }) => createdBy?.name
  );

  const filteredData = data.filter(
    (item: any) => createdBy === "All" || item?.createdBy?.name === createdBy
  );
  // filter end

  const columns = [
    {
      key: "expenseDate",
      label: "Expense Date",
      customClass: "whitespace-nowrap",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {format(new Date(row?.expenseDate), "dd/MMM/yyyy p")}
          </span>
        );
      },
    },
    {
      key: "purpose",
      label: "Purpose",
      render: (row: any) => (
        <div className="whitespace-nowrap">{row?.purpose}</div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (row: any) => (
        <div className="line-clamp-3 max-w-72">{row?.description}</div>
      ),
    },

    {
      key: "createdAt",
      label: "Entry",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {format(new Date(row?.createdAt), "dd/MMM/yyyy p")}
            <br />
            By: {row.createdBy?.name}
          </span>
        );
      },
    },
    {
      key: "updatedAt",
      label: "Edited",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {row.updatedBy && format(new Date(row?.updatedAt), "dd/MMM/yyyy p")}
            <br />
            {row.updatedBy && <span> By: {row.updatedBy?.name}</span>}
          </span>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">{row?.amount}</div>
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
              <h3 className="font-bold text-textPrimary">Expense By:</h3>
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
            title="Expense"
            caption={
              <div className="pt-3">
                <h2 className="hidden print:block text-black text-xl font-bold underline">
                  Expense
                </h2>
                <p className="text-black">
                  Date From {formatedStartDate} To {formatedEndDate}
                </p>
                <h3 className="test-base font-bold text-black mb-2 print:mb-0 pt-2 px-2 print:border-gray-600 border-b-4 border-double capitalize flex justify-between">
                  <span>{`Expense By: ${createdBy}`}</span>
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
            sumFields={["amount"]}
          />
        </div>
      </div>
    </div>
  );
}
