"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  SquaresPlusIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TagIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { IoWalletOutline } from "react-icons/io5";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { BiSupport } from "react-icons/bi";
import Image from "next/image";
import logo from "../../../../public/logo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigations = [
  {
    heading: "MENU",
    headingClassName: "pl-4 pt-2 pb-4",
    navItems: [
      { name: "Dashboard", href: "/user/dashboard", icon: SquaresPlusIcon, roles: ["super_admin", "admin", "store_incharge"] },
      { name: "Product", href: "/user/product", icon: ShoppingBagIcon, roles: ["super_admin", "admin", "store_incharge", "salesman"] },
      {
        group: "Stock",
        items: [
          { name: "All Stocks", href: "/user/stock", roles: ["super_admin", "admin", "store_incharge", "salesman"] },
          { name: "Low Stocks", href: "/user/low-stock", roles: ["super_admin", "admin", , "store_incharge", "salesman"] },
        ],
        icon: CubeIcon,
        roles: ["super_admin", "admin", "store_incharge", "salesman"],
      },
      { name: "Customer", href: "/user/customer", icon: UserIcon, roles: ["super_admin", "admin", "store_incharge", "salesman"] },
      {
        group: "Sales",
        items: [{ name: "Sales History", href: "/user/order", roles: ["super_admin", "admin", "store_incharge", "salesman"] }],
        icon: ShoppingCartIcon,
        roles: ["super_admin", "admin", "store_incharge", "salesman"],
      },
      {
        group: "Purchases",
        items: [
          { name: "Purchase", href: "/user/purchase", roles: ["super_admin", "admin", "store_incharge",] },
          { name: "Suppliers Management", href: "/user/supplier", roles: ["super_admin", "admin", "store_incharge",] },
        ],
        icon: TagIcon,
        roles: ["super_admin", "admin", "store_incharge",],
      },
      {
        group: "Inventory",
        items: [
          { name: "Shelves", href: "/user/shelve", roles: ["super_admin", "admin", "store_incharge", "salesman"] },
          { name: "Category", href: "/user/category", roles: ["super_admin", "admin", "store_incharge", "salesman"] },
          { name: "Generic", href: "/user/generic", roles: ["super_admin", "admin",] },
          { name: "Brand", href: "/user/brand", roles: ["super_admin", "admin", "store_incharge", "salesman"] },
        ],
        icon: BuildingStorefrontIcon,
        roles: ["super_admin", "admin", "store_incharge", "salesman"],
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
        roles: ["super_admin", "admin", "store_incharge", "salesman"],
      },
      { name: "Expenses", href: "/user/expense", icon: IoWalletOutline, roles: ["super_admin", "admin", "store_incharge"] },
    ],
  },
  {
    heading: "SETTINGS",
    navItems: [{ name: "Tax", href: "/user/tax", icon: HiOutlineReceiptTax, roles: ["super_admin", "admin"] }],
  },
  {
    heading: "HELP",
    navItems: [
      { name: "Contact Support", href: "/user/support", icon: BiSupport, roles: ["super_admin", "admin", "store_incharge", "salesman"] },
    ],
  },
];

function filterNavigationsByRole(navigations: any, userRole: any) {
  return navigations.map((section: any) => {
    const filteredNavItems = section.navItems.filter((navItem: any) => {
      // If it's a group, filter the items within the group
      if (navItem.group) {
        navItem.items = navItem.items.filter((item: any) => item.roles.includes(userRole));
        return navItem.items.length > 0 && navItem.roles.includes(userRole);
      }
      // If it's a regular nav item, just check its roles
      return navItem.roles.includes(userRole);
    });

    return { ...section, navItems: filteredNavItems };
  }).filter((section: any) => section.navItems.length > 0);
}


function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function Sidebar({
  handleSidebarCollapsed,
  handleForceSidebarCollapsed,
  user
}: {
  handleSidebarCollapsed?: any;
  handleForceSidebarCollapsed?: any;
  user: any;
}) {
  const pathname = usePathname();

  const filteredNavigations = filterNavigationsByRole(navigations, user?.role)

  return (
    <aside>
      <nav className="h-screen bg-gray-800 text-gray-100  overflow-auto flex flex-col justify-between  scrollbar-thumb-gray-500 scrollbar-track-gray-100 scrollbar-thin 2xl:text-base text-sm">
        <div>
          <div className="p-3 top-0 sticky z-[999] border-b border-gray-600 bg-gray-800">
            <Link
              href="/"
              className="text-xl font-semibold pt-0.5 flex items-center gap-2"
            >
              <Image
                src={logo}
                alt="Logo"
                height={45}
                className="flex-shrink-0"
              />
              <h2 className="truncate">
                {process.env.NEXT_PUBLIC_APP_NAME}
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
            {filteredNavigations.map((nav: any, index: number) => (
              <div key={index}>
                <p
                  className={`${nav?.headingClassName
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
                        onClick={handleForceSidebarCollapsed}
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
                                      ? "block pl-4 py-0.5 leading-7  bg-gray-700 text-white border-l border-l-gray-600"
                                      : "block pl-4 py-0.5 leading-7 transition duration-200 hover:bg-gray-700 text-gray-400 hover:text-white border-l border-l-gray-600"
                                  }
                                  onClick={handleForceSidebarCollapsed}
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
          <p className="text-gray-300 text-center">
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
