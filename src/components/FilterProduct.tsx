"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import ReactSelect, { SelectInstance } from "react-select";
import Button from "./ui/button/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { reactSelectStyles } from "@/styles/reactSelectStyles";

export default function FilterProduct({
  categories,
  brands,
  generics,
}: {
  categories: any;
  brands: any;
  generics: any;
}) {
  const categorySelectRef = useRef<SelectInstance | null>(null);
  const brandSelectRef = useRef<SelectInstance | null>(null);
  const genericSelectRef = useRef<SelectInstance | null>(null);
  const statusSelectRef = useRef<SelectInstance | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  //############# filter initial state set start #############
  const categoryOptions = categories.map((item: any) => {
    return { label: `${item?.name}`, value: item?._id };
  });

  const brandOptions = brands.map((item: any) => {
    return { label: `${item?.name}`, value: item?.name };
  });

  const genericOptions = generics.map((item: any) => {
    return { label: `${item?.name}`, value: item?.name };
  });

  // status options for react select
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Deactive", value: "deactive" },
  ];
  const initialcategoryOptions = categoryOptions.filter((category: any) => category?.value === searchParams.get("category"))
  const initialBrandOptions = brandOptions.filter((brand: any) => brand?.value === searchParams.get("brand"))
  const initialgenericNameOptions = genericOptions.filter((generic: any) => generic?.value === searchParams.get("genericName"))
  const initialStatusOptions = statusOptions.filter((option: any) => option?.value === searchParams.get("status"))
  // ############# end of filter initial state set  #############


  const [category, setCategory] = useState<any>(initialcategoryOptions.length > 0 ? initialcategoryOptions : null);
  const [brand, setBrand] = useState<any>(initialBrandOptions.length > 0 ? initialBrandOptions : null);
  const [genericName, setGenericName] = useState<any>(initialgenericNameOptions.length > 0 ? initialgenericNameOptions : null);
  const [status, setStatus] = useState<any>(initialStatusOptions.length > 0 ? initialStatusOptions : null);

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
    if (
      category !== null ||
      brand !== null ||
      genericName !== null ||
      status !== null
    ) {
      setAppliFilter(true);
    } else {
      setAppliFilter(false);
    }
  }, [category, brand, genericName, status]);


  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("brand");
    params.delete("genericName");
    params.delete("status");
    replace(`${pathname}?${params.toString()}`);

    setCategory(null);
    setBrand(null);
    setGenericName(null);
    setStatus(null);
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
          className="absolute right-0 bg-white z-[991] mt-2 sm:w-96 w-80 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="grid gap-4 p-4">
            <label>
              <span className="font-semibold block pb-0.5">Category</span>
              <ReactSelect
                ref={categorySelectRef}
                name="category"
                options={categoryOptions}
                isClearable={true}
                styles={reactSelectStyles}
                value={category}
                onChange={(value: any) => {
                  setCategory(value);
                  handleFilter("category", value?.value);
                }}
              />
            </label>
            <label>
              <span className="font-semibold block pb-0.5">Brand</span>
              <ReactSelect
                ref={brandSelectRef}
                name="brand"
                options={brandOptions}
                isClearable={true}
                styles={reactSelectStyles}
                value={brand}
                onChange={(value: any) => {
                  setBrand(value);
                  handleFilter("brand", value?.value);
                }}
              />
            </label>
            <label>
              <span className="font-semibold block pb-0.5">Generic Name</span>
              <ReactSelect
                ref={genericSelectRef}
                name="genericName"
                options={genericOptions}
                isClearable={true}
                styles={reactSelectStyles}
                value={genericName}
                onChange={(value: any) => {
                  setGenericName(value);
                  handleFilter("genericName", value?.value);
                }}
              />
            </label>
            <label>
              <span className="font-semibold block pb-0.5">Product Status</span>
              <ReactSelect
                ref={statusSelectRef}
                name="status"
                options={statusOptions}
                isClearable={true}
                styles={reactSelectStyles}
                value={status}
                onChange={(value: any) => {
                  setStatus(value);
                  handleFilter("status", value?.value);
                }}
              />
            </label>

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
