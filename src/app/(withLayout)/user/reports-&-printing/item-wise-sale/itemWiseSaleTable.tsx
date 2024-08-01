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

export default function ItemWiseSaleTable({
  salesItems,
  startDate,
  endDate,
  totalPages,
  limit,
}: {
  salesItems: any[];
  startDate: any;
  endDate: any;
  totalPages: number;
  limit: number;
}) {
  const [createdBy, setCreatedBy] = useState<any>("All");
  const [status, setStatus] = useState<any>("All");

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
    salesItems,
    ({ createdBy }: { createdBy: any }) => createdBy[0]?.name
  );

  const filteredData = salesItems.filter(
    (item: any) => createdBy === "All" || item?.createdBy[0]?.name === createdBy
  ).filter(
    (item: any) =>
      status === "All" ||
      (status === "delivered" && item?.orderStatus === 'delivered') ||
      (status === "partial-refund" && item?.orderStatus === 'partial-refund') ||
      (status === "full-refund" && item?.orderStatus === 'full-refund')
  )
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
      key: "product",
      label: "Product",
      render: (row: any) => {
        return (
          <div>
            {row?.product[0]?.name} {row?.product[0]?.code && `,${row?.product[0]?.code}`}
          </div>
        );
      },
    },
    { key: 'unit', label: 'Unit' },
    {
      key: "quantity",
      label: "Qty",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">{row?.quantity}</div>
      ),
    },
    {
      key: "refundQuantity",
      label: "Ref/Qty",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">{row?.refundQuantity}</div>
      ),
    },
    {
      key: "orderStatus",
      label: "Status",
      customClass: "text-center",
      render: (row: any) => (
        <div
          className={
            row?.orderStatus === "delivered"
              ? "bg-[#28A745] bg-opacity-[.12] text-[#28A745] font-medium rounded-full text-center m-auto w-28 py-0.5"
              : row?.orderStatus.includes("full-refund")
                ? "bg-[#FF0000] bg-opacity-[.12] text-[#FF0000] font-medium rounded-full text-center m-auto w-28 !py-0.5"
                : "bg-[#FFC107] bg-opacity-[.12] text-[#917322] font-medium rounded-full text-center m-auto w-28 !py-0.5"
          }
        >
          <span className="capitalize">
            {" "}
            {row?.orderStatus && row?.orderStatus.replace("-", " ")}
          </span>
        </div>
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

            {/* Filter by Status */}
            <h3 className="font-bold text-textPrimary pt-3 mb-2 border-b border-gray-500">
              Order Status
            </h3>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${status === "All"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => setStatus("All")}
            >
              All
            </button>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${status === "delivered"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => setStatus("delivered")}
            >
              Delivered
            </button>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${status === "partial-refund"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => setStatus("partial-refund")}
            >
              Partial refund
            </button>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${status === "full-refund"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => setStatus("full-refund")}
            >
              Full refund
            </button>

          </div>
        </div>
        <div className="px-4 pb-6 w-full card">
          {/* Table component */}
          <Table
            title=" Sales report (Item wise)"
            caption={
              <div className="pt-3">
                <h1 className="hidden print:block text-black text-2xl font-bold">
                  Medinova Pharmacy
                </h1>
                <h2 className="hidden print:block text-black text-xl font-bold underline">
                  Sales report (Item wise)
                </h2>
                <p className="text-black">
                  Date From {formatedStartDate} To {formatedEndDate}
                </p>
                <h3 className="test-base font-bold text-black mb-2 print:mb-0 pt-2 px-2 print:border-gray-600 border-b-4 border-double capitalize flex justify-between">
                  <span>{`Sale By: ${createdBy}`}</span>
                  <span>{`Order Staus: ${status}`}</span>
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
            sumFields={["quantity", "refundQuantity"]}
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
