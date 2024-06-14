"use client";

/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ChevronDownIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUser } from "@/lib/getUser";
import { logoutUser } from "@/api-services/auth/logoutUser";
import Avatar from "../Avatar";
import { RiFullscreenExitLine, RiFullscreenLine } from "react-icons/ri";
import "core-js";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userNameFirstLetter, setUserNameFirstLetter] = useState('H')
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const navigation = [
    {
      name: "Menu",
      submenu: [
        { name: "Accounts", href: "/user/accounts" },
        { name: "Bill", href: "/user/bill" },
        { name: "Doctors", href: "/user/doctors" },
        { name: "Patients", href: "/user/patients" },
        { name: "Patient management", href: "/user/patient-management" },
        { name: "Services", href: "/user/services" },
      ],
    },
    { name: "Admin", href: "/admin/dashboard" }
  ];

  const filteredNavigation = navigation.filter((item: any) => {
    if (user?.role === "super_admin" ||  user?.role === "admin") {
      // Show all menu items for selected user
      return true;
    } else if (item.name === "Admin") {
      return false;
    }
    // Show other menu items for other roles
    return true;
  });

  const sortedNavigation = filteredNavigation.sort((a: any, b: any) =>
  a.name.localeCompare(b.name)
);


  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== 'undefined') {
      if (user) {
        setUserNameFirstLetter(user.name.charAt(0).toUpperCase())
      }
    }
  }, [user]);



  const logout = async () => {
    await logoutUser();
    router.push("/login", { scroll: false });
  }


  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      });
    }
  };

  return (
    <Disclosure as="nav" className="bg-white border-b border-zinc-200">
      {({ open }: {open: any}) => (
        <>
          <div className="px-4 py-2 lg:py-0">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center lg:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-zinc-900  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-shrink-0 items-center ml-2 lg:ml-0">
                <Link href='/' className="relative rounded-full w-8 h-8 text-xl  bg-[#F4F4F5] text-zinc-900 text-center grid place-content-center">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg> */}
                  <HomeIcon className="w-6 h-6" />
                </Link>

              </div>
              <div className="flex flex-1 items-center justify-start lg:items-stretch lg:justify-start">
                <div className="hidden lg:ml-6 lg:block">
                  <div className="flex space-x-6">
                    {sortedNavigation.map((item) =>
                      item.submenu ? (
                        <Menu
                          key={item.name}
                          as="div"
                          className="relative group"
                        >
                          <div>
                            <Menu.Button className="text-zinc-800  group-hover:text-zinc-900  border-gray-100 flex items-center px-1 2xl:py-4 py-3">
                              {item.name}
                              <ChevronDownIcon
                                className="h-5 w-5 flex-none text-zinc-400"
                                aria-hidden="true"
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute left-0 z-10 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {item.submenu.map((item: any) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <Link
                                      href={item.href}
                                      className={classNames(
                                        pathname === item.href
                                          ? "bg-gray-200 text-gray-900 hover:bg-gray-200"
                                          : "",
                                        "block px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                                      )}
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      ) : (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            pathname === item.href
                              ? "text-zinc-900"
                              : "text-zinc-800 hover:text-zinc-900 border-gray-300",
                            "px-1 2xl:py-4 py-3"
                          )}
                        >
                          {item.name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="relative rounded-md w-8 h-8 text-xl  bg-[#F4F4F5] text-zinc-900 text-center"
                  onClick={toggleFullScreen}
                >
                  {isFullScreen ? <RiFullscreenExitLine className="mx-auto" /> : <RiFullscreenLine className="mx-auto" />}

                </button>

                <button
                  type="button"
                  className="relative rounded-md w-8 h-8 bg-[#F4F4F5] text-zinc-900 text-center"
                >
                  <BellIcon className="mx-auto w-6 h-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button>
                      <Avatar name={userNameFirstLetter} />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 bg-white z-10 mt-2 w-48 origin-top-right rounded-md bg- py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/user/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-3 py-1 text-sm text-gray-700"
                            )}
                          >
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>
                      {
                        user && (user.role === 'admin' || user.role === 'super_admin') &&
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/admin/dashboard"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-3 py-1 text-sm text-gray-700"
                              )}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                      }
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            type='button'
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full text-left px-3 py-1 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) =>
                item.submenu ? (
                  <span key={item.name}>
                    <Disclosure.Button
                      className="text-zinc-800 hover:bg-gray-100 hover:text-gray-900
                                       flex items-center justify-between w-full rounded-md px-3 py-2 "
                    >
                      {item.name}
                      <ChevronDownIcon
                        className={classNames(
                          open ? "rotate-180" : "",
                          "h-5 w-5 flex-none"
                        )}
                        aria-hidden="true"
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="ml-3">
                      {item.submenu.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="text-zinc-800 hover:bg-gray-100 hover:text-gray-900
                                                   flex items-center justify-between w-full rounded-md px-3 py-2 text-sm"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </Disclosure.Panel>
                  </span>
                ) : (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-zinc-800 hover:bg-gray-100 hover:text-gray-900",
                      "block rounded-md px-3 py-2"
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                )
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
