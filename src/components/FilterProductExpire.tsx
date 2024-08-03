"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import Button from "./ui/button/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Checkbox from "./ui/form/Checkbox";

export default function FilterProductExpire() {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();


  const [isExpired, setIsExpired] = useState<any>(searchParams.get("isExpired") === null ? false : searchParams.get("isExpired"));

  const [appliFilter, setAppliFilter] = useState<any>(false);

  const handleFilter = (source: any, term: any) => {
    const params = new URLSearchParams(searchParams);

    // check and update the params
    if (source === source && term) {
      params.set(source, term);
    } else if (source === source && !term) {
      params.delete(source);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (isExpired !== false) {
      setAppliFilter(true);
    } else {
      setAppliFilter(false);
    }
  }, [isExpired]);

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("isExpired");
    replace(`${pathname}?${params.toString()}`);

    setIsExpired(false);
    setAppliFilter(false);
  };



  return (
    <Menu as="div" className="relative">
      <div>
        <MenuButton>
          <Button
            variant={appliFilter ? `danger-light` : "primary-light"}
            className="py-1.5 px-2 border-transparent"
          >
            <FunnelIcon className="h-5 w-5" />
          </Button>
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
        <MenuItems
          as="div"
          className="absolute right-0 bg-white z-[9999] mt-2 sm:w-96 w-80 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="grid gap-4 p-4">
            <Checkbox
              label="Only Expired Product"
              labelClassName="font-bold text-red-500"
              inlineClassName="items-center"
              checked={isExpired}
              onChange={(e: any) => {
                const isChecked = e.target.checked;
                setIsExpired(isChecked);
                handleFilter("isExpired", isChecked);
              }}
            />

            <Button
              variant="primary"
              className="justify-center"
              onClick={handleClearFilter}
            >
              Clear All Filter
            </Button>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
