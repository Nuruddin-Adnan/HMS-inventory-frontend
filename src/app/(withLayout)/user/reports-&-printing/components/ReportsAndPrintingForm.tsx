"use client"

import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/form/Input';
import toastError from '@/helpers/toastError';
import { getUser } from '@/lib/getUser';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import "core-js";
import { format } from 'date-fns';

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
    { title: 'Expense', value: '/user/reports-&-printing/expense', roles: ["super_admin", "admin", "store_incharge"] },
    { title: 'Purchase report', value: '/user/reports-&-printing/purchase', roles: ["super_admin", "admin", "store_incharge"] },
    { title: 'Purchase Report (Payment Wise)', value: '/user/reports-&-printing/purchase-payment-wise', roles: ["super_admin", "admin", "store_incharge"] },
    { title: 'Purchase refund report', value: '/user/reports-&-printing/purchase-refund', roles: ["super_admin", "admin", "store_incharge"] },
    { title: 'Sales refund', value: '/user/reports-&-printing/sales-refund', roles: ["super_admin", "admin", "store_incharge", "salesman"] },
    { title: 'Refund wise sales item', value: '/user/reports-&-printing/refund-wise-sales-item', roles: ["super_admin", "admin", "store_incharge", "salesman"] },
    { title: 'Sales Report (Summary)', value: '/user/reports-&-printing/sale-summary', roles: ["super_admin", "admin", "store_incharge", "salesman"] },
    { title: 'Sales Report', value: '/user/reports-&-printing/sale', roles: ["super_admin", "admin", "store_incharge", "salesman"] },
    { title: 'Sales Refund (Amount wise)', value: '/user/reports-&-printing/sale-refund-amount-wise', roles: ["super_admin", "admin", "store_incharge", "salesman"] },
    { title: 'Sales Report (With Items)', value: '/user/reports-&-printing/sale-with-item', roles: ["super_admin", "admin", "store_incharge", "salesman"] },
    { title: 'Sales Report (Payment Wise)', value: '/user/reports-&-printing/sales-report-payment-wise', roles: ["super_admin", "admin", "store_incharge", "salesman"] },
    { title: 'Sales Report (Item wise)', value: '/user/reports-&-printing/item-wise-sale', roles: ["super_admin", "admin", "store_incharge", "salesman"] },

    { title: 'Income statement', value: '/user/reports-&-printing/income-statement', roles: ["super_admin", "admin", "store_incharge",] },
];

export default function ReportsAndPrintingForm({ user }: { user: any }) {
    const [selectedValue, setSelectedValue] = useState(null);
    const router = useRouter();

    // sorted alphabetically 
    const sortedItems = listItems.sort((a, b) => a.title.localeCompare(b.title));

    // filter by user role
    const filteredItemsByRole = sortedItems.filter((item: any) => item.roles.includes(user?.role))


    const handleInputChange = (value: any) => {
        setSelectedValue(value);
    };

    const startDateTime = () => {
        const now = new Date();
        // Set time to 12:00 AM
        now.setHours(0, 0, 0, 0);
        return format(now, "yyyy-MM-dd'T'HH:mm");
    }


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
            <div className="md:grid grid-cols-3 items-center gap-10">
                <div className="rounded-md border md:m-6 w-full col-span-1 overflow-hidden">
                    <ul style={listStyle.list} className='max-h-[70vh] overflow-y-auto'>
                        {filteredItemsByRole.map((item) => (
                            <li className='hover:bg-gray-100 text-sm' key={item.value} style={listStyle.listItem}>

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
                <div className='col-span-2 md:mt-0 mt-4'>
                    <div className="card md:p-6 p-3 border max-w-lg mx-auto grid space-y-3">
                        <div className="grid grid-cols-2 2xl:space-x-4 space-x-3">
                            <Input type="datetime-local" name="startDate" label="Start Date" defaultValue={startDateTime()} />
                            <Input type="datetime-local" name="endDate" label="End Date" defaultValue={format(new Date, "yyyy-MM-dd'T'HH:mm")} />
                        </div>
                        <Button type="submit" variant="primary" className="w-full block">Show Result</Button>
                    </div>
                </div>
            </div>
        </form>

    )
}
