"use client";

import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import "core-js";
import Table from "@/components/ui/table/Table";
import { GroupByHelper } from "@/helpers/groupByHelper";
import { toFixedIfNecessary } from "@/helpers/toFixedIfNecessary";
import { useReactToPrint } from "react-to-print";
import { getSingleOrderClient } from "@/api-services/order/getSingleOrderClient";
import toastError from "@/helpers/toastError";
import Invoice from "@/components/Invoice";

const pageStyle = `
@page{
    margin: 30px;  
}
`;

export default function SaleWithItemTable({
  sales,
  startDate,
  endDate,
  totalPages,
  limit,
}: {
  sales: any[];
  startDate: any;
  endDate: any;
  totalPages: number;
  limit: number;
}) {
  const [createdBy, setCreatedBy] = useState<any>("All");
  const [paymentType, setPaymentType] = useState<any>("All");
  const [heading, setHeading] = useState<any>("All");

  // print setup
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef(null);
  const promiseResolveRef = useRef<((value: any) => void) | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>();

  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current(undefined);
    }
  }, [isPrinting]);

  // print invoice
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
    pageStyle: pageStyle,
  });

  const handlePrintInvoice = async (invoiceNo: any) => {
    if (invoiceNo.length >= 8) {
      const result = await getSingleOrderClient(invoiceNo);
      if (result && result.success === true) {
        if (!result?.data) {
          toastError("No order found!");
        } else {
          setInvoiceData(result?.data);
          handlePrint();
        }
      }
    }
  };

  // filter start
  const dataGroupByEntryBy = GroupByHelper.groupBy(
    sales,
    ({ createdBy }: { createdBy: any }) => createdBy[0]?.name
  );

  const filteredData = sales.filter(
    (item: any) => createdBy === "All" || item?.createdBy[0]?.name === createdBy
  ).filter(
    (item: any) =>
      paymentType === "All" ||
      (paymentType === "due" && item?.due > 0) ||
      (paymentType === "paid" && item?.due === 0)
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
    {
      key: "BILLID",
      label: "Invoice",
      render: (row: any) => {
        return (
          <button
            className="underline text-[#000186] print:no-underline"
            onClick={() => handlePrintInvoice(row.BILLID)}
          >
            {row.BILLID}
          </button>
        );
      },
    },
    {
      key: "Bill",
      label: "Bill",
      customClass: "text-center",
      render: (row: any) => {
        return (
          <div className="capitalize text-right font-medium whitespace-nowrap">
            <p>Customer: {row?.customer[0]?.contactNo ?? 'Walk-in'}</p>
            <p>Total: {toFixedIfNecessary(row?.total, 2)}</p>
            <p>Received: {toFixedIfNecessary(row?.received, 2)}</p>
            <p>Due: {toFixedIfNecessary(row?.due, 2)}</p>
          </div>
        );
      },
    },
    {
      key: "productDetails",
      label: "Products",
      render: (row: any) => (
        <table className="w-full">
          <thead className="">
            <tr>
              <th className="text-start border border-gray-400 px-1">Item</th>
              <th className="border border-gray-400 px-1 w-20">Unit</th>
              <th className="border border-gray-400 px-1 w-14">Qty</th>
            </tr>
          </thead>
          <tbody>
            {row?.items?.map((item: any, index: number) => <tr key={item?._id}>
              <td className="border border-gray-400 px-1"><span className="font-medium pr-0.5">{index + 1}.</span>{item?.productDetails[0]?.name}</td>
              <td className="border border-gray-400 px-1">
                {item?.unit}
              </td>
              <td className="border border-gray-400 px-1 text-center">
                {item?.quantity}
              </td>
            </tr>)}
          </tbody>
        </table>
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
            title="Sales Report(With items)"
            caption={
              <div className="pt-3">
                <h1 className="hidden print:block text-black text-2xl font-bold">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </h1>
                <h2 className="hidden print:block text-black text-xl font-bold underline">
                  Sales Report(With items)
                </h2>
                <p className="text-black">
                  Date From {formatedStartDate} To {formatedEndDate}
                </p>
                <h3 className="test-base font-bold text-black mb-2 print:mb-0 pt-2 px-2 print:border-gray-600 border-b-4 border-double capitalize flex justify-between">
                  <span>{`Sale By: ${createdBy}`}</span>
                  <span>{`Payment Type: ${heading}`}</span>
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
            backBtn
            tableHeightClass="h-[calc(100vh-180px)]"
            pagination
            totalPages={totalPages}
            limit={limit}
          />
        </div>
      </div>

      {isPrinting && (
        <div style={{ display: "none" }}>
          <div ref={printRef}>
            <Invoice order={invoiceData} />
          </div>
        </div>
      )}
    </div>
  );
}
