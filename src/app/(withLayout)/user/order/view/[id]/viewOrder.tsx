"use client"

import React, { useRef } from 'react'
import InvoiceLg from '@/components/InvoiceLg'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { useRouter } from "next/navigation";
import { useReactToPrint } from 'react-to-print';
import generatePDF from 'react-to-pdf';
import Invoice from '@/components/Invoice';

export default function ViewOrder({ data }: { data: any }) {
    const componentRef = useRef<any>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const router = useRouter();
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-2 flex justify-end gap-x-3">
                <button className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-neutral-800 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white dark:focus:ring-offset-gray-800" onClick={() => generatePDF(componentRef, { filename: `INV-${data?.BILLID}.pdf` })}>
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                    Download PDF
                </button>
                <button className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" onClick={handlePrint}>
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>
                    Print
                </button>
                <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none" onClick={() => router.back()}>

                    <ArrowUturnLeftIcon className='w-5 h-5' />
                </button>
            </div>
            <div ref={componentRef}>
                <InvoiceLg order={data} />
            </div>
        </div>
    )
}
