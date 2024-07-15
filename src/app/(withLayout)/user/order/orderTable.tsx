"use client";

import Table from "@/components/ui/table/Table";
import { getUser } from "@/lib/getUser";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  InboxArrowDownIcon,
  PencilIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function OrderTable({ orders }: { orders: any[] }) {
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
    { key: "BILLID", label: "Invoice No" },
    {
      key: "customer",
      label: "Customer",
      render: (row: any) => <div>{row?.customer[0]?.contactNo}</div>,
    },
    {
      key: "subtotal",
      label: "Subtotal",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.subtotal.toFixed(2)}
        </div>
      ),
    },
    {
      key: "vatAmount",
      label: "Vat",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.vatAmount?.toFixed(2)}
        </div>
      ),
    },
    {
      key: "discountAmount",
      label: "Disount",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.discountAmount?.toFixed(2)}
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.total?.toFixed(2)}
        </div>
      ),
    },
    {
      key: "refundTotal",
      label: "Refund total",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.refundTotal?.toFixed(2)}
        </div>
      ),
    },
    {
      key: "refundAmount",
      label: "Refund",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.refundAmount?.toFixed(2)}
        </div>
      ),
    },
    {
      key: "received",
      label: "Received",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.received?.toFixed(2)}
        </div>
      ),
    },
    {
      key: "due",
      label: "Due",
      customClass: "text-right w-24 pr-5",
      render: (row: any) => (
        <div className="text-right font-medium pr-4">
          {row?.due?.toFixed(2)}
        </div>
      ),
    },
    {
      key: "paymentStatus",
      label: "Status",
      customClass: "text-center",
      render: (row: any) => (
        <div
          className={
            row?.paymentStatus === "paid" ||
            row?.paymentStatus === "discount-paid"
              ? "bg-[#28A745] bg-opacity-[.12] text-[#28A745] font-medium rounded-full text-center m-auto w-28 py-0.5"
              : row?.paymentStatus.includes("refund")
              ? "bg-[#FF0000] bg-opacity-[.12] text-[#FF0000] font-medium rounded-full text-center m-auto w-28 !py-0.5"
              : "bg-[#FFC107] bg-opacity-[.12] text-[#917322] font-medium rounded-full text-center m-auto w-28 !py-0.5"
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
        "sticky right-0 bg-white print:hidden z-[940]",
      render: (row: any) => (
        <Menu>
          <MenuButton className="bg-white p-0.5 rounded-full border border-gray-100 text-gray-500">
            <EllipsisVerticalIcon className="size-6 bg-white" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="w-52 z-[999] origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm/6  transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 shadow"
          >
            <MenuItem>
              <Link
                href={`/user/order/view/${row?.BILLID}`}
                className="group flex w-full items-center gap-2 rounded-lg py-1 px-3 hover:bg-gray-200"
              >
                <EyeIcon className="size-4 fill-white/30" />
                View
              </Link>
            </MenuItem>
            {row?.due > 0 && (
              <MenuItem>
                <Link
                  href={`/user/order/due/${row?.BILLID}`}
                  className="group flex w-full items-center gap-2 rounded-lg py-1 px-3 hover:bg-gray-200"
                >
                  <InboxArrowDownIcon className="size-4 fill-white/30" />
                  Due Collection
                </Link>
              </MenuItem>
            )}
            <MenuItem>
              <Link
                href={`/user/order/refund/${row?.BILLID}`}
                className="group flex w-full items-center gap-2 rounded-lg py-1 px-3 hover:bg-gray-200 "
              >
                <ReceiptRefundIcon className="size-4 fill-white/30" />
                Refund
              </Link>
            </MenuItem>
          </MenuItems>
        </Menu>
      ),
    },
  ];

  return (
    <div>
      {/* Table component */}
      <Table
        title="Sells Report"
        caption={
          <h2 className="hidden pt-3 print:block text-black text-xl font-bold underline">
            Orders
          </h2>
        }
        columns={columns}
        data={orders}
        uniqueKey="BILLID"
        customTfClass="text-right whitespace-nowrap"
        customThClass="whitespace-nowrap"
        customTdClass="py-0.5 text-sm"
        responsive
        sort
      />
    </div>
  );
}
