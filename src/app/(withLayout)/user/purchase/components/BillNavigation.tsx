"use client";

import { getUser } from "@/lib/getUser";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function BillNavigation() {
  const [role, updateRole] = useState("");
  const user = getUser();
  const pathname = usePathname();

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== "undefined") {
      if (user) {
        updateRole(user.role);
      }
    }
  }, [user]);

  const navigation = [
    { name: "New", href: "/user/purchase/create" },
    { name: "Due collection", href: "/user/purchase/due" },
    { name: "Update", href: "/user/purchase/update" },
    { name: "Refund", href: "/user/purchase/refund" },
  ];

  // Filter navigation based on role
  const filteredNavigation = navigation.filter((item) => {
    if (
      role === "admin" ||
      role === "super_admin" ||
      role === "store_incharge"
    ) {
      // Show all menu items for admin, super_admin and store_incharge
      return true;
    } else if (item.name === "Refund Approved" || item.name === "Re-discount") {
      return false;
    }
    // Show other menu items for other roles
    return true;
  });

  // if need multiple menu or multiple user filter use this block
  // // Filter navigation based on role
  // const filteredNavigation = navigation.filter(item => {
  //     if (role === "admin" || role === "super_admin") {
  //         // Show all menu items for admin and super_admin
  //         return true;
  //     } else if (item.name === "Refund" || item.name === "Refund Approved") {
  //         // Exclude "Refund" and "Refund Approved" for other roles
  //         return false;
  //     }
  //     // Show other menu items for other roles
  //     return true;
  // });

  return (
    <div className="flex items-center space-x-4 border-b pb-1 mb-2">
      {filteredNavigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={classNames(
            pathname === item.href
              ? "text-primary underline"
              : "text-zinc-900 hover:text-zinc-900 border-gray-300",
            "px-1 2xl:pb-3 pb-2"
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
