"use client";

/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useState } from "react";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/getUser";
import { logoutUser } from "@/api-services/auth/logoutUser";
import Avatar from "../Avatar";
import { RiFullscreenExitLine, RiFullscreenLine } from "react-icons/ri";

export default function Header({
  handleSidebarCollapsed,
}: {
  handleSidebarCollapsed?: any;
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userNameFirstLetter, setUserNameFirstLetter] = useState("H");
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== "undefined") {
      if (user) {
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
        setUserNameFirstLetter(initials);
      }
    }
  }, [user]);

  const logout = async () => {
    await logoutUser();
    router.push("/login", { scroll: false });
  };

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
    <Disclosure
      as="nav"
      className="bg-white border-b border-zinc-200 sticky top-0 z-[998] shadow-sm"
    >
      {({ open }: { open: any }) => (
        <>
          <div className="px-4 py-2">
            <div className="relative flex items-center justify-between">
              <div className="flex flex-1 items-center justify-start lg:items-stretch lg:justify-start">
                <button onClick={() => handleSidebarCollapsed()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                    />
                  </svg>
                </button>
              </div>
              <button className="border border-red-500 rounded py-1.5 px-4 font-bold inline-block text-red-600 mr-8 hover:bg-red-200 transition">
                POS
              </button>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="relative rounded-md w-8 h-8 text-xl  bg-[#F4F4F5] text-zinc-900 text-center"
                  onClick={toggleFullScreen}
                >
                  {isFullScreen ? (
                    <RiFullscreenExitLine className="mx-auto" />
                  ) : (
                    <RiFullscreenLine className="mx-auto" />
                  )}
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
                    <MenuButton>
                      <Avatar name={userNameFirstLetter} />
                    </MenuButton>
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
                    <MenuItems className="absolute right-0 bg-white z-10 mt-2 w-48 origin-top-right rounded-md bg- py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        <Link
                          href="/user/profile"
                          className={
                            "flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          }
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
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>

                          <span>My Profile</span>
                        </Link>
                      </MenuItem>
                      {user &&
                        (user.role === "admin" ||
                          user.role === "super_admin") && (
                          <MenuItem>
                            <Link
                              href="/admin/dashboard"
                              className={
                                "flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 w-full"
                              }
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
                                  d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"
                                />
                              </svg>

                              <span>Dashboard</span>
                            </Link>
                          </MenuItem>
                        )}
                      <MenuItem>
                        <button
                          onClick={logout}
                          type="button"
                          className={
                            "flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          }
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
                              d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                            />
                          </svg>

                          <span>Sign out</span>
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
