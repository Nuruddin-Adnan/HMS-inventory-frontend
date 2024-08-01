'use client'

import Button from '@/components/ui/button/Button'
import { PrinterIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import { format } from "date-fns";
import numWords from 'num-words';
import { useRouter } from 'next/navigation';

const pageStyle = `
@page{
    size: portrait;
    margin: 30px;  
}
`

export default function IncomeStatementTable({
    orderSummary,
    salePayment,
    saleRefund,
    purchasePayment,
    purchaseRefund,
    expense,
    startDate,
    endDate
}: {
    orderSummary: any;
    salePayment: any;
    saleRefund: any;
    purchasePayment: any;
    purchaseRefund: any;
    expense: any;
    startDate: any,
    endDate: any
}) {
    const componentRef = useRef(null);
    const router = useRouter()


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: pageStyle,
    });

    const formatedStartDate = format(new Date(startDate), "dd-MMM-yyyy p");
    const formatedEndDate = format(new Date(endDate), "dd-MMM-yyyy p");

    const totalPaymentReceive = (salePayment?.totalNewPayment ?? 0) + (salePayment?.totalDuePayment ?? 0);
    const totalSaleRefund = saleRefund?.amount ?? 0;
    const totalPurchase = (purchasePayment?.totalNewPayment ?? 0) + (purchasePayment?.totalDuePayment ?? 0)
    const totalPurchaseRefund = purchaseRefund?.amount ?? 0;
    const totalExpense = expense?.amount ?? 0;

    const netRevenue = totalPaymentReceive + totalPurchaseRefund;
    const netExpense = totalSaleRefund + totalPurchase + totalExpense

    const netIncome = (netRevenue - netExpense)

    return (
        <div className="flex space-x-5 max-w-5xl mx-auto">
            <div className="px-4 pb-6 w-full card overflow-auto">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 2xl:p-4 p-3">

                    <h2 className="font-bold 2xl:text-2xl text-xl text-textPrimary">
                        Income Statement
                    </h2>
                    <div className='flex gap-2'>
                        <Button
                            variant="primary-light"
                            className="py-1.5 px-2 border-transparent"
                            onClick={handlePrint}
                        >
                            <PrinterIcon className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="danger"
                            className="py-1 px-1.5 border-transparent"
                            onClick={() => router.back()}
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
                <div ref={componentRef}>
                    <div className="print:p-10 max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="hidden print:block pt-3 text-black text-2xl font-bold">
                                Medinova Pharmacy
                            </h1>
                            <h2 className="hidden print:block text-black text-xl font-bold underline">Income Statement</h2>
                            <p className="text-black">Date From {formatedStartDate} To {formatedEndDate}</p>
                        </div>

                        <h3 className='text-base font-bold text-textPrimary'>Revenue</h3>
                        <div className="w-full overflow-auto md:px-5 px-2">
                            <table className="w-full table-auto md:whitespace-nowrap md:text-base">
                                <tbody>
                                    <tr>
                                        <td>New Payment Received: (Customer: {salePayment?.totalNewCustomer ?? 0})</td>
                                        <td className='text-right'>{salePayment?.totalNewPayment.toFixed(2) ?? 0}</td>
                                    </tr>
                                    <tr>
                                        <td>(+) Total Due collection: (Customer: {salePayment?.totalDueCustomer ?? 0})</td>
                                        <td className='text-right'>{salePayment?.totalDuePayment.toFixed(2) ?? 0}</td>
                                    </tr>
                                    <tr>
                                        <td>(+) Purchase Refund Amount:</td>
                                        <td className='text-right'>{totalPurchaseRefund?.toFixed(2) ?? 0}</td>
                                    </tr>
                                    <tr className='border-t border-black'>
                                        <th className='text-right pt-2 w-full'>Total Revenue</th>
                                        <th className='text-right pt-2'><span className='sm:w-52 w-28 block'>
                                            {netRevenue.toFixed(2)}
                                            /-</span></th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h3 className='text-base font-bold text-textPrimary'>Expense</h3>
                        <div className="w-full overflow-auto md:px-5 px-2">
                            <table className="w-full table-auto md:whitespace-nowrap md:text-base">
                                <tbody>
                                    <tr>
                                        <td>Total Sales Refund:</td>
                                        <td className='text-right'>{totalSaleRefund?.toFixed(2) ?? 0}</td>
                                    </tr>
                                    <tr>
                                        <td> (+) New Purchase:</td>
                                        <td className='text-right'>{purchasePayment?.totalNewPayment.toFixed(2) ?? 0}</td>
                                    </tr>
                                    <tr>
                                        <td>(+) Due Purchase Payment:</td>
                                        <td className='text-right'>{purchasePayment?.totalDuePayment.toFixed(2) ?? 0}</td>
                                    </tr>
                                    <td>(+) Various Expense</td>
                                    <td className='text-right'>{totalExpense?.toFixed(2)}</td>
                                    <tr className='border-t border-black'>
                                        <th className='text-right pt-2 w-full'>(-) Total Expense</th>
                                        <th className='text-right pt-2'><span className='sm:w-52 w-28 block'>
                                            {netExpense?.toFixed(2) ?? 0}
                                            /-</span></th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {
                            netIncome >= 0 ?
                                <h3 className='text-base font-bold text-green-700 flex md:flex-row flex-col-reverse md:justify-between md:items-center items-end gap-4 mt-5'>
                                    <span>Net Income: <span className='capitalize text-sm font-bold'>({numWords(Math.floor(netIncome))}) Tk only</span></span>
                                    <span className='border-t-4 border-t-black border-double w-52 text-right md:mr-5'><span className='md:hidden inline-block pr-10'>Net:</span>{netIncome.toFixed(2)}/-</span>
                                </h3> :
                                <h3 className='text-base font-bold text-red-500 flex md:flex-row flex-col-reverse md:justify-between md:items-center items-end gap-4 mt-5'>
                                    <span>Net Loss: <span className='capitalize text-sm font-bold'>({numWords(Math.floor(Math.abs(netIncome)))}) Tk only</span></span>
                                    <span className='border-t-4 border-t-black border-double w-52 text-right md:mr-5'><span className='md:hidden inline-block pr-10'>Net:</span>{netIncome.toFixed(2)}/-</span>
                                </h3>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}
