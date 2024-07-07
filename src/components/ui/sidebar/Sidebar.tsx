"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  SquaresPlusIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { IoWalletOutline } from "react-icons/io5";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { BiSupport } from "react-icons/bi";
import Image from "next/image";
import logoFull from "../../../../public/logo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigations = [
  {
    heading: "MENU",
    headingClassName: "pl-4 pt-2 pb-4",
    navItems: [
      { name: "Dashboard", href: "/user/dashboard", icon: SquaresPlusIcon },
      { name: "Product", href: "/user/product", icon: ShoppingBagIcon },
      { name: "Stock", href: "/user/stock", icon: ChartBarIcon },
      { name: "Customer", href: "/user/customer", icon: UserIcon },
      {
        group: "Sales",
        items: [
          { name: "POS", href: "/pos" },
          { name: "Sales History", href: "/user/order" },
        ],
        icon: ShoppingCartIcon,
      },
      {
        group: "Purchases",
        items: [
          { name: "Purchase", href: "/user/purchase" },
          { name: "Suppliers Management", href: "/user/supplier" },
        ],
        icon: TagIcon,
      },
      {
        group: "Inventory",
        items: [
          { name: "Shelves", href: "/user/shelve" },
          { name: "Category", href: "/user/category" },
          { name: "Generic", href: "/user/generic" },
          { name: "Brand", href: "/user/brand" },
        ],
        icon: BuildingStorefrontIcon,
      },
    ],
  },
  {
    heading: "ACCOUNTS",
    navItems: [
      {
        name: "Reports",
        href: "/user/reports-&-printing",
        icon: ClipboardDocumentListIcon,
      },
      { name: "Expenses", href: "/user/expense", icon: IoWalletOutline },
    ],
  },
  {
    heading: "SETTINGS",
    navItems: [{ name: "Tax", href: "/user/tax", icon: HiOutlineReceiptTax }],
  },
  {
    heading: "HELP",
    navItems: [
      { name: "Contact Support", href: "/user/support", icon: BiSupport },
    ],
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function Sidebar({
  handleSidebarCollapsed,
}: {
  handleSidebarCollapsed?: any;
}) {
  const pathname = usePathname();

  return (
    <aside>
      <nav className="h-screen bg-gray-800 text-gray-100  overflow-auto flex flex-col justify-between  scrollbar-thumb-gray-500 scrollbar-track-gray-100 scrollbar-thin">
        <div>
          <div className="p-3 top-0 sticky  z-[999] border-b border-gray-600 bg-gray-800">
            <Link
              href="/"
              className="text-2xl font-semibold pt-0.5 flex items-center gap-2"
            >
              <Image src={logoFull} alt="Logo" className="flex-shrink-0" />
              <h2 className="truncate">
                {process.env.NEXT_PUBLIC_APP_NAME || "Your app name"}
              </h2>
            </Link>
          </div>

          {/* Sidebar links */}
          <div className="space-y-0 mt-4 relative">
            <div className="absolute right-4 top-0">
              <button
                className="rounded-full size-9 grid place-items-center bg-gray-900 xl:hidden"
                onClick={() => handleSidebarCollapsed()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
              </button>
            </div>
            {/* full navigation start */}
            {navigations.map((nav: any, index: number) => (
              <div key={index}>
                <p
                  className={`${
                    nav?.headingClassName
                      ? nav?.headingClassName
                      : "pl-4 pt-6 pb-2"
                  } text-gray-400`}
                >
                  {nav?.heading}
                </p>
                {nav.navItems.map((item: any, index: number) => {
                  if (!item.group) {
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        className={
                          pathname.startsWith(item.href)
                            ? "flex items-center py-2 px-4  bg-gray-700 text-white"
                            : "flex items-center py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white"
                        }
                      >
                        <item.icon className="h-6 w-6 mr-2" />
                        {item.name}
                      </Link>
                    );
                  } else {
                    return (
                      <Disclosure as="div" key={index}>
                        {({ open }) => (
                          <>
                            <DisclosureButton className="w-full py-1.5 px-4 flex justify-between leading-7 transition duration-200 hover:bg-gray-700 hover:text-white">
                              <div className="flex">
                                <div>
                                  <item.icon className="h-6 w-6 mr-2" />
                                </div>
                                <span className="text-start">{item.group}</span>
                              </div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className={classNames(
                                  open ? "rotate-90" : "",
                                  "size-5 flex-none mt-1 text-zinc-400"
                                )}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                              </svg>
                            </DisclosureButton>
                            <DisclosurePanel className="space-y-0 pr-4 pl-7">
                              {item.items.map((item: any) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  className={
                                    pathname.startsWith(item.href)
                                      ? "block pl-4 py-0.5 text-sm leading-7  bg-gray-700 text-white border-l border-l-gray-600"
                                      : "block pl-4 py-0.5 text-sm leading-7 transition duration-200 hover:bg-gray-700 text-gray-400 hover:text-white border-l border-l-gray-600"
                                  }
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </DisclosurePanel>
                          </>
                        )}
                      </Disclosure>
                    );
                  }
                })}
              </div>
            ))}
            {/*//End of full navigation */}
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="w-full p-4 border-t mt-5 border-t-gray-800 sticky bottom-0 bg-gray-900">
          <p className="text-gray-300 text-xs">
            Powered by
            <a
              href={process.env.NEXT_PUBLIC_POWERED_BY_LINK}
              className=" ml-1 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {process.env.NEXT_PUBLIC_POWERED_BY}
            </a>
          </p>
        </div>
      </nav>
    </aside>
  );
}
