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
  const [heading, setHeading] = useState<any>("All");
  const [discountHeading, setDiscountHeading] = useState<any>("All");
  const [createdBy, setCreatedBy] = useState<any>("All");
  const [paymentType, setPaymentType] = useState<any>("All");
  const [discountType, setDiscountType] = useState<any>("All");

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

  const filteredData = data.filter(
    (item: any) => createdBy === "All" || item?.createdBy[0]?.name === createdBy
  ).filter(
    (item: any) =>
      paymentType === "All" ||
      (paymentType === "due" && item?.due > 0) ||
      (paymentType === "paid" && item?.due === 0)
  )
    .filter(
      (item: any) =>
        discountType === "All" ||
        (discountType === "no-discount" && item?.discountAmount === 0) ||
        (discountType === "discount" && item?.discountAmount > 0)
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
        <div className="capitalize text-right font-medium">{toFixedIfNecessary(row?.subtotal, 2)}</div>
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
        <div className="capitalize text-right font-medium">{toFixedIfNecessary(row?.total, 2)}</div>
      ),
    },
    {
      key: "received",
      label: "Received",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">{toFixedIfNecessary(row?.received, 2)}</div>
      ),
    },
    {
      key: "due",
      label: "Due",
      customClass: "text-right",
      render: (row: any) => (
        <div className="capitalize text-right font-medium">{toFixedIfNecessary(row?.due, 2)}</div>
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

            {/* Filter by Discount type */}
            <h3 className="font-bold text-textPrimary pt-3 mb-2 border-b border-gray-500">
              Discount Type
            </h3>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${discountType === "All"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => {
                setDiscountType("All"),
                  setDiscountHeading("All");
              }}
            >
              All
            </button>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${discountType === "no-discount"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => {
                setDiscountType("no-discount"),
                  setDiscountHeading("No Discount");
              }}
            >
              No Discount
            </button>
            <button
              className={`py-0.5 px-2 text-sm border block w-full text-left whitespace-nowrap ${discountType === "discount"
                ? "bg-primary bg-opacity-10 text-primary"
                : "focus:bg-primary focus:bg-opacity-10 focus:text-primary hover:bg-gray-200"
                }`}
              onClick={() => {
                setDiscountType("discount"),
                  setDiscountHeading("Discount");
              }}
            >
              Discount
            </button>
          </div>
        </div>
        <div className="px-4 pb-6 w-full card">
          {/* Table component */}
          <Table
            title="Sales Report"
            caption={
              <div className="pt-3">
                <h1 className="hidden print:block text-black text-2xl font-bold">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </h1>
                <h2 className="hidden print:block text-black text-xl font-bold underline">
                  Sales Report
                </h2>
                <p className="text-black">
                  Date From {formatedStartDate} To {formatedEndDate}
                </p>
                <h3 className="test-base font-bold text-black mb-2 print:mb-0 pt-2 px-2 print:border-gray-600 border-b-4 border-double capitalize flex justify-between">
                  <span>{`Sale By: ${createdBy}`}</span>
                  <span>{`Payment Type: ${heading}`}</span>
                  <span>{`Discount Type: ${discountHeading}`}</span>
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
            backBtn
            tableHeightClass="h-[calc(100vh-180px)]"
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
