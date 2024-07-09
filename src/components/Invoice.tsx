import { format } from 'date-fns';
import React from 'react'

export default function Invoice({ order }: { order: any }) {
    const {
        BILLID,
        subtotal,
        discountAmount,
        vatAmount,
        total,
        received,
        due,
        paymentStatus,
        items,
        customer,
        payments,
        refunds,
        totalRefundAmount,
        createdBy,
        createdAt,
    } = order;

    return (
        <div className='max-w-md mx-auto p-5 pt-10 bg-white'>
            <header>
                <div className='text-center'>
                    <h1 className='font-bold text-xl'>{process.env.NEXT_PUBLIC_APP_NAME}</h1>
                    <address className='not-italic font-bold'>
                        236/1/A, Soth Pirerbag, Mirpur, Dhaka 1216 <br />
                        Phone: {process.env.NEXT_PUBLIC_APP_CONTACT_NO}
                    </address>
                    <p className='py-2'>VAT Reg No # 001092713</p>
                    <h3 className='font-bold pb-2'>  Invoice No: {BILLID}</h3>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                    <div>
                        <p> Data: {format(new Date(createdAt), "dd/MMM/yyyy")}</p>
                        <p>Customer ID:  {customer[0]?.CUSID}</p>
                        <p>Customer Name:  {customer[0]?.name}</p>
                    </div>
                    <div>
                        <p>Time: {format(new Date(createdAt), "p")}</p>
                        <p>Served By: {createdBy[0]?.name}</p>
                    </div>
                </div>
            </header>
        </div>
    )
}
