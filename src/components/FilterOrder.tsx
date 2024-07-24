"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import ReactSelect, { SelectInstance } from "react-select";
import Button from "./ui/button/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { reactSelectStyles } from "@/styles/reactSelectStyles";
import Checkbox from "./ui/form/Checkbox";

export default function FilterOrder() {
  const paymentStatusSelectRef = useRef<SelectInstance | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  //############# filter initial state set start #############
  // statu options for react select
  const paymentStatusOptions = [
    { label: "Paid", value: "paid" },
    { label: "Discount Paid", value: "discount-paid" },
    { label: "Unpaid", value: "unpaid" },
    { label: "Partial paid", value: "partial-paid" },
    { label: "Partial refund", value: "partial-refund" },
    { label: "Full refund", value: "full-refund" },
  ];
  const initialPaymentStatusOptions = paymentStatusOptions.filter((option: any) => option?.value === searchParams.get("paymentStatus"))
  // ############# end of filter initial state set  #############

  const [paymentStatus, setPaymentStatus] = useState<any>(initialPaymentStatusOptions.length > 0 ? initialPaymentStatusOptions : null);
  const [isDue, setIsDue] = useState<any>(searchParams.get("isDue") === null ? false : searchParams.get("isDue"));

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
    if (paymentStatus !== null || isDue !== false) {
      setAppliFilter(true);
    } else {
      setAppliFilter(false);
    }
  }, [isDue, paymentStatus]);

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("paymentStatus");
    params.delete("isDue");
    replace(`${pathname}?${params.toString()}`);

    setPaymentStatus(null);
    setIsDue(false);
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
            <label>
              <span className="font-semibold block pb-0.5">Payment Status</span>
              <ReactSelect
                ref={paymentStatusSelectRef}
                name="paymentStatus"
                options={paymentStatusOptions}
                isClearable={true}
                styles={reactSelectStyles}
                value={paymentStatus}
                onChange={(value: any) => {
                  setPaymentStatus(value);
                  handleFilter("paymentStatus", value?.value);
                }}
              />
            </label>
            <Checkbox
              label="Show only Due"
              labelClassName="font-bold text-red-500"
              inlineClassName="items-center"
              checked={isDue}
              onChange={(e: any) => {
                const isChecked = e.target.checked;
                setIsDue(isChecked);
                handleFilter("isDue", isChecked);
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
