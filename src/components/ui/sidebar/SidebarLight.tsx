"use client";

import { Disclosure } from "@headlessui/react";
import {
  SquaresPlusIcon,
  DocumentTextIcon,
  UsersIcon,
  ShieldCheckIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { MdOutlineMedicalServices } from "react-icons/md";
import Image from "next/image";
import logoFull from "../../../../public/logo-full.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuStethoscope } from "react-icons/lu";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: SquaresPlusIcon },
  { name: "Permission", href: "/admin/permission", icon: ShieldCheckIcon },
  { name: "User", href: "/admin/user", icon: UsersIcon },
  {
    name: "Report format",
    href: "/admin/report-format",
    icon: ClipboardDocumentListIcon,
  },
];

const bdgeoNavigation = [
  { name: "Division", href: "/admin/bd/division" },
  { name: "District", href: "/admin/bd/district" },
  { name: "Upazila", href: "/admin/bd/upazila" },
];

const serviceNavigation = [
  { name: "Service Division", href: "/admin/service-division" },
  { name: "Service Department", href: "/admin/service-department" },
  { name: "Service Group", href: "/admin/service-group" },
  { name: "Service Type", href: "/admin/service-type" },
  { name: "Service", href: "/admin/service" },
];

const doctorNavigation = [
  {
    name: "Doctor Specialization",
    href: "/admin/doctor/doctor-specialization",
  },
  { name: "Doctor Designation", href: "/admin/doctor/doctor-designation" },
  { name: "Doctor Visit", href: "/admin/doctor/doctor-visit" },
  { name: "Doctors", href: "/admin/doctor/doctor" },
];

// Settings
const settingsNavigation = [
  { name: "Report Mode", href: "/admin/report-mode" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function SidebarLight() {
  const pathname = usePathname();

  return (
    <div>
      <nav className="h-screen bg-white  w-64 overflow-auto flex flex-col justify-between  scrollbar-thumb-gray-500 scrollbar-track-gray-100 scrollbar-thin border-r border-r-gray-300">
        <div>
          <div className="p-3 top-0 sticky bg-white z-[999]">
            <div className="text-zinc-900 text-2xl font-semibold pt-0.5">
              <Image src={logoFull} alt="Logo" />
            </div>
          </div>

          {/* Sidebar links */}
          <div className="space-y-0 mt-4 px-4">
            <p className="text-zinc-600 pl-4  pb-2">MENU</p>
            {navigation.map((item: any, index: number) => (
              <Link
                key={index}
                href={item.href}
                className={
                  pathname.startsWith(item.href)
                    ? "bg-primary text-white flex items-center py-1.5 px-4 rounded-lg"
                    : "flex items-center py-1.5 px-4 rounded-lg text-zinc-900 hover:bg-zinc-100"
                }
              >
                <item.icon className="h-6 w-6 mr-2" />
                {item.name}
              </Link>
            ))}

            <Disclosure as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full py-1.5 px-4 flex justify-between leading-7 text-zinc-900 hover:bg-zinc-100 rounded-lg">
                    <div className="flex">
                      <div>
                        <MapPinIcon className="h-6 w-6 mr-2" />
                      </div>
                      <span className="text-start">BD GEO</span>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={classNames(
                        open ? "rotate-90" : "",
                        "h-5 w-5 flex-none mt-1 text-zinc-400"
                      )}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Disclosure.Button>
                  <Disclosure.Panel className="space-y-0 px-4">
                    {bdgeoNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={
                          pathname.startsWith(item.href)
                            ? "block pl-8 py-0.5 text-sm leading-7 rounded-md text-white bg-primary"
                            : "block pl-8 py-0.5 text-sm leading-7 rounded-md text-zinc-900 hover:bg-zinc-100"
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full py-1.5 px-4 flex justify-between leading-7 text-zinc-900 hover:bg-zinc-100 rounded-lg">
                    <div className="flex">
                      <div>
                        <MdOutlineMedicalServices className="h-6 w-6 mr-2" />
                      </div>
                      <span className="text-start">Service</span>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={classNames(
                        open ? "rotate-90" : "",
                        "h-5 w-5 flex-none mt-1 text-zinc-400"
                      )}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Disclosure.Button>
                  <Disclosure.Panel className="space-y-0 px-4">
                    {serviceNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={
                          pathname === item.href
                            ? "block pl-8 py-0.5 text-sm leading-7 rounded-md text-white bg-primary"
                            : "block pl-8 py-0.5 text-sm leading-7 rounded-md text-zinc-900 hover:bg-zinc-100"
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full py-1.5 px-4 flex justify-between leading-7 text-zinc-900 hover:bg-zinc-100 rounded-lg">
                    <div className="flex">
                      <div>
                        <LuStethoscope className="h-6 w-6 mr-2" />
                      </div>
                      <span className="text-start">Doctor</span>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={classNames(
                        open ? "rotate-90" : "",
                        "h-5 w-5 flex-none mt-1 text-zinc-400"
                      )}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Disclosure.Button>
                  <Disclosure.Panel className="space-y-0 px-4">
                    {doctorNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={
                          pathname === item.href
                            ? "block pl-8 py-0.5 text-sm leading-7 rounded-md text-white bg-primary"
                            : "block pl-8 py-0.5 text-sm leading-7 rounded-md text-zinc-900 hover:bg-zinc-100"
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <p className="text-zinc-600 pl-4 pt-6 pb-2">SETTINGS MENU</p>
            <Disclosure as="div">
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full py-1.5 px-4 flex justify-between leading-7 text-zinc-900 hover:bg-zinc-100 rounded-lg">
                    <div className="flex">
                      <div>
                        <Cog6ToothIcon className="h-6 w-6 mr-2" />
                      </div>
                      <span className="text-start">Settings</span>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={classNames(
                        open ? "rotate-90" : "",
                        "h-5 w-5 flex-none mt-1 text-zinc-400"
                      )}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Disclosure.Button>
                  <Disclosure.Panel className="space-y-0 px-4">
                    {settingsNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={
                          pathname === item.href
                            ? "block pl-8 py-0.5 text-sm leading-7 rounded-md text-white bg-primary"
                            : "block pl-8 py-0.5 text-sm leading-7 rounded-md text-zinc-900 hover:bg-zinc-100"
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="w-full p-4 border-t mt-5 border-t-gray-100 sticky bottom-0 bg-gray-100">
          <p className="text-gray-500 text-xs">
            Powered by
            <a
              href="#"
              className="text-zinc-900 ml-1 hover:underline"
              // target="_blank"
              rel="noopener noreferrer"
            >
              Md. Nuruddin Adnan
            </a>
          </p>
        </div>
      </nav>
    </div>
  );
}
