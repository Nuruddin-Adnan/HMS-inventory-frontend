"use client";

import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  InboxArrowDownIcon,
  PencilIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PurchaseTable({ purchases }: { purchases: any[] }) {
  const [role, updateRole] = useState("");
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== "undefined") {
      if (user) {
        updateRole(user.role);
      }
    }
  }, [user]);

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
          <span className="block">{row?.supplier?.brandInfo?.name}</span>
        </div>
      ),
    },
    { key: "invoiceNo", label: "Invoice No" },
    { key: "lotNo", label: "Lot No" },
    {
      key: "expiryDate",
      label: "Expiry Date",
      render: (row: any) => {
        return (
          <span className="whitespace-nowrap">
            {format(new Date(row?.expiryDate), "dd/MM/yyyy")}
          </span>
        );
      },
    },
    { key: "unit", label: "Unit" },
    {
      key: "price",
      label: "Price",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.price}</div>
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
      key: "refundQuantity",
      label: "Rf/ Qty",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.refundQuantity}</div>
      ),
    },
    {
      key: "total",
      label: "Total",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.total}</div>
      ),
    },
    {
      key: "advance",
      label: "Advance",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.advance}</div>
      ),
    },
    {
      key: "due",
      label: "Due",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">{row?.due}</div>
      ),
    },
    {
      key: "paymentStatus",
      label: "Status",
      customClass: "text-center",
      render: (row: any) => (
        <div
          className={
            row?.paymentStatus === "paid"
              ? "bg-[#28A745] bg-opacity-[.12] text-[#28A745] font-medium rounded-full text-center m-auto w-28"
              : row?.paymentStatus.includes("refund")
                ? "bg-[#FF0000] bg-opacity-[.12] text-[#FF0000] font-medium rounded-full text-center m-auto w-28 !py-0"
                : "bg-[#FFC107] bg-opacity-[.12] text-[#917322] font-medium rounded-full text-center m-auto w-28 !py-0"
          }
        >
          <span className="capitalize">
            {" "}
            {row?.paymentStatus && row?.paymentStatus.replace("-", " ")}
          </span>
        </div>
      ),
    },
    {
      key: "Action",
      label: "Action",
      customClass: "bg-white sticky right-0 print:hidden z-[941]",
      customDataClass: (row: any) =>
        "sticky right-0 2xl:bg-transparent bg-white print:hidden z-[940]",
      render: (row: any) => (
        <Menu>
          <MenuButton className="bg-white p-1 rounded-full border border-gray-100 text-gray-500">
            <EllipsisVerticalIcon className="size-6 " />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="w-52 z-[999] origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm/6  transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 shadow"
          >
            <MenuItem>
              <Link
                href={`/user/purchase/update/${row?.BILLID}`}
                className="group flex w-full items-center gap-2 rounded-lg py-1 px-3 hover:bg-gray-200"
              >
                <PencilIcon className="size-4 fill-white/30" />
                Edit
              </Link>
            </MenuItem>
            {row?.due > 0 && (
              <MenuItem>
                <Link
                  href={`/user/purchase/due/${row?.BILLID}`}
                  className="group flex w-full items-center gap-2 rounded-lg py-1 px-3 hover:bg-gray-200"
                >
                  <InboxArrowDownIcon className="size-4 fill-white/30" />
                  Due Collection
                </Link>
              </MenuItem>
            )}
            {row?.quantity !== row?.refundQuantity && (
              <MenuItem>
                <Link
                  href={`/user/purchase/refund/${row?.BILLID}`}
                  className="group flex w-full items-center gap-2 rounded-lg py-1 px-3 hover:bg-gray-200 "
                >
                  <ReceiptRefundIcon className="size-4 fill-white/30" />
                  Refund
                </Link>
              </MenuItem>
            )}
          </MenuItems>
        </Menu>
      ),
    },
  ];

  return (
    <div>
      {/* Table component */}
      <Table
        caption={
          <div>
            <h1 className="hidden print:block pt-3 text-black text-2xl font-bold">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <h2 className="hidden mb-2 print:block text-black text-xl font-bold underline">
              purchases
            </h2>
          </div>
        }
        columns={columns}
        data={purchases}
        uniqueKey="BILLID"
        customTfClass="text-right whitespace-nowrap"
        customThClass="whitespace-nowrap bg-gray-200"
        customTdClass="py-0.5 text-sm"
        create={
          new Set(["super_admin", "admin", "store_incharge"]).has(role)
            ? "/user/purchase/create"
            : undefined
        }
        tableStriped
        responsive
        sort
        print
        tableHeightClass="h-[calc(100vh-170px)]"
      />
    </div>
  );
}
