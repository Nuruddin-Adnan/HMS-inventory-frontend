"use client";

import React from "react";
import {
  SquaresPlusIcon,
  NewspaperIcon,
  UsersIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { BiSupport } from "react-icons/bi";
import { VscTriangleLeft } from "react-icons/vsc";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logoBlue from "../../../../public/Logo-blue.svg";
import Image from "next/image";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { BsJournalMedical } from "react-icons/bs";

const navigation = [
  { name: "Patient Management", href: "/user/patient-management", icon: SquaresPlusIcon },
  { name: "Bill", href: "/user/bill", icon: LiaFileInvoiceDollarSolid },
  { name: "Print Money Receipt", href: "/user/print-money-receipt", icon: NewspaperIcon },
  { name: "Reports & printing", href: "/user/reports-&-printing", icon: PrinterIcon },
  { name: "Referral", href: "/user/referral", icon: UsersIcon },
  // { name: "Report Generation", href: "/user/report-generate/report-generate-one", icon: BsJournalMedical },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="2xl:w-20 w-16 bg-white h-screen sticky top-0 flex-shrink-0 border-r border-zinc-200 z-[999]">
      <div className="flex flex-col justify-between h-full">
        <div>
          <Image src={logoBlue} alt="blue logo" className="w-full" priority={true} />
          <ul>
            {navigation.map((item: any, index: number) => (
              <li key={index} className="relative group">
                <Link
                  href={item.href}
                  className={
                    pathname.startsWith(item.href)
                      ? "2xl:py-3 2xl:mx-3 py-2 mx-2 my-1 rounded block text-primary bg-primary bg-opacity-10"
                      : "2xl:py-3 2xl:mx-3 py-2 mx-2 my-1 rounded block text-gray-700 hover:bg-gray-100"
                  }
                >
                  <item.icon className="h-6 w-6 mx-auto" />
                </Link>
                <span className="absolute whitespace-nowrap left-full top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-md z-[1090] hidden group-hover:flex items-center">
                  <VscTriangleLeft className="text-gray-800 -ml-[17px]" />{" "}
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/user/support" className="py-3 mt-4 2xl:mx-3 mx-1 block text-gray-700 border-t">
          <BiSupport className="h-6 w-6 mx-auto" /> Support
        </Link>
      </div>
    </div>
  );
}
