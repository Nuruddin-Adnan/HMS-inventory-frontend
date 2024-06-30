"use client"

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/form/Input';
import toastError from '@/helpers/toastError';
import { getUser } from '@/lib/getUser';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import "core-js";

const listStyle: any = {
    list: {
        listStyle: 'none',
    },
    listItem: {
        position: 'relative',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
    },
    label: {
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'background-color 0.3s',
        display: 'block',
        padding: '7px 10px 7px 30px',
        fontWeight: 600,
        width: '100%',
        textAlign: 'left',
    },
    checkedLabel: {
        backgroundColor: '#e5f2ff',
        color: '#007BFF',
    },
    radioInput: {
        position: 'absolute',

        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        // display: 'none',
    }
};

const listItems = [
    { title: 'Sales report', value: '/user/reports-&-printing/sales-report' },
    { title: 'Purchase report', value: '/user/reports-&-printing/purchase-report' },
    { title: 'Payment wise sales', value: '/user/reports-&-printing/payment-wise-sales' },
    { title: 'Refund wise sales', value: '/user/reports-&-printing/refund-wise-sales' },
    { title: 'Payment wise purchase', value: '/user/reports-&-printing/payment-wise-purchase' },
    { title: 'Refund wise purchase', value: '/user/reports-&-printing/refund-wise-purchase' },
    { title: 'Income Statement', value: '/user/reports-&-printing/income-statement' },
    { title: 'Expense', value: '/user/reports-&-printing/expense' },
];




export default function ReportsAndPrintingForm() {
    const [selectedValue, setSelectedValue] = useState(null);
    const router = useRouter();
    const user = getUser();


    // Filter navigation based on role
    const filteredListItems = listItems
        .filter(item => {
            if (user?.role === "admin" || user?.role === "super_admin" || user?.role === "store_incharge" || user?.role === "salesman") {
                // Show all menu items for selected user
                return true;
            } else if (
                item.title === "Sales report" ||
                item.title === "Purchase report" ||
                item.title === "Payment wise sales" ||
                item.title === "Refund wise sales" ||
                item.title === "Payment wise purchase" ||
                item.title === "Refund wise purchase"
            ) {
                return false;
            }

            // Show other menu items for other roles
            return true;
        })
        .filter(item => {
            if (user?.role === "super_admin") {
                // Show all menu items for selected user
                return true;
            } else if (
                item.title === "Some secret menu"
            ) {
                return false;
            }
            // Show other menu items for other roles
            return true;
        })
        .filter(item => {
            if (user?.role === "super_admin" || user?.role === "admin" || user?.role === "store_incharge") {
                // Show all menu items for selected user
                return true;
            } else if (
                item.title === "Expense" ||
                item.title === "Income Statement"
            ) {
                return false;
            }
            // Show other menu items for other roles
            return true;
        })

    const sortedListItems = filteredListItems.sort((a, b) => a.title.localeCompare(b.title));

    const handleInputChange = (value: any) => {
        setSelectedValue(value);
    };

    const handleSubmit = async (formData: FormData) => {
        const date1 = new Date(formData.get("startDate") as any)
        const date2 = new Date(formData.get("endDate") as any)

        if (!selectedValue) {
            toastError('Please select a list')
        } else if (!(formData.get("startDate") && formData.get("endDate") && formData.get("list"))) {
            toastError('Please enter a valid date')
        } else if (date1.getTime() > date2.getTime()) {
            toastError('End date can not be larger than start date')
        } else {
            const list = selectedValue;

            const startDateString = `${formData.get("startDate")}:00.000Z`;
            const endDateString = `${formData.get("endDate")}:59.999Z`;

            // Create a new Date object
            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);

            // Subtract 6 hours from the current date and time
            startDate.setHours(startDate.getHours() - 6);//bangladesh local time is less than UTC time
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            endDate.setHours(endDate.getHours() - 6);//bangladesh local time is less than UTC time
            endDate.setSeconds(59);
            endDate.setMilliseconds(999);

            const startDateToISOString = startDate.toISOString();
            const endDateToISOString = endDate.toISOString();

            router.push(`${list}?startDate=${startDateToISOString}&endDate=${endDateToISOString}`)
        }
    };

    return (
        <form action={handleSubmit}>
            <div className="border-b border-gray-200 2xl:p-4 p-3">
                <h2 className='font-bold 2xl:text-xl text-lg text-textPrimary'>Reports & Printing</h2>
            </div>
            <div className="grid grid-cols-3 items-center gap-10">
                <div className="rounded-md border m-6 w-full col-span-1 overflow-hidden">
                    <ul style={listStyle.list} className='max-h-[70vh] overflow-y-auto'>
                        {sortedListItems.map((item) => (
                            <li className='hover:bg-gray-100' key={item.value} style={listStyle.listItem}>

                                <input
                                    type="radio"
                                    name="list"
                                    id={item.value}
                                    style={listStyle.radioInput}
                                    onChange={() => handleInputChange(item.value)}
                                    checked={selectedValue === item.value}
                                />
                                <label
                                    htmlFor={item.value}
                                    style={{ ...listStyle.label, ...(selectedValue === item.value ? listStyle.checkedLabel : {}) }}
                                >
                                    {item.title}

                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='col-span-2'>
                    <div className="card p-6 border max-w-lg mx-auto grid space-y-3">
                        <div className="grid grid-cols-2 2xl:space-x-4 space-x-3">
                            <Input type="datetime-local" name="startDate" label="Start Date" />
                            <Input type="datetime-local" name="endDate" label="End Date" />
                        </div>
                        <Button type="submit" variant="primary" className="w-full block">Show Result</Button>
                    </div>
                </div>
            </div>
        </form>

    )
}
