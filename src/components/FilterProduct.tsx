'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react'
import { FunnelIcon } from '@heroicons/react/24/outline'
import ReactSelect, { SelectInstance } from "react-select";
import Button from './ui/button/Button'

export default function FilterProduct({
    categories,
    brands,
    generics
}: {
    categories: any;
    brands: any;
    generics: any;
}) {
    const categorySelectRef = useRef<SelectInstance | null>(null);
    const brandSelectRef = useRef<SelectInstance | null>(null);
    const genericSelectRef = useRef<SelectInstance | null>(null);
    const [category, setCategory] = useState<any>(null);
    const [brand, setBrand] = useState<any>(null);
    const [genericName, setGenericName] = useState<any>(null);
    const [appliFilter, setAppliFilter] = useState<any>(false);

    useEffect(() => {
        if (category !== null || brand !== null || genericName !== null) {
            setAppliFilter(true)
        } else {
            setAppliFilter(false)
        }
    }, [category, brand, genericName])


    const reactSelectStyles = {
        control: (baseStyles: any) => ({
            ...baseStyles,
            minHeight: "auto",
            color: "#18181B",
            padding: "0px",
            border: "1px solid #e5e7eb",
        }),
        indicatorsContainer: (provided: any) => ({
            ...provided,
            padding: "0px",
            minHeight: "auto",
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            padding: "0px 4px",
        }),
    };

    const handleClearFilter = () => {
        setCategory(null)
        setBrand(null)
        setGenericName(null)
        setAppliFilter(false)
    }

    const categoryOptions = categories.map((item: any) => {
        return { label: `${item?.name}`, value: item?._id };
    });

    const brandOptions = brands.map((item: any) => {
        return { label: `${item?.name}`, value: item?.name };
    });

    const genericOptions = generics.map((item: any) => {
        return { label: `${item?.name}`, value: item?.name };
    });
    return (
        <Menu as="div" className="relative">
            <div>
                <MenuButton>
                    <Button
                        variant={appliFilter ? `danger` : 'primary-light'}
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
                <MenuItems as="div" className="absolute right-0 bg-white z-10 mt-2 sm:w-96 w-80 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className='grid gap-4 p-4'>
                        <label>
                            <span className="font-semibold block pb-0.5">Category</span>
                            <ReactSelect
                                ref={categorySelectRef}
                                name="category"
                                options={categoryOptions}
                                isClearable={true}
                                styles={reactSelectStyles}
                                value={category}
                                onChange={(value) => setCategory(value)}
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
                                onChange={(value) => setBrand(value)}
                            />
                        </label>
                        <label>
                            <span className="font-semibold block pb-0.5">Generic Name</span>
                            <ReactSelect
                                ref={genericSelectRef}
                                name="generic"
                                options={genericOptions}
                                isClearable={true}
                                styles={reactSelectStyles}
                                value={genericName}
                                onChange={(value) => setGenericName(value)}
                            />
                        </label>
                        <Button variant="primary" className="justify-center" onClick={handleClearFilter}>Clear All Filter</Button>
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    )
}
