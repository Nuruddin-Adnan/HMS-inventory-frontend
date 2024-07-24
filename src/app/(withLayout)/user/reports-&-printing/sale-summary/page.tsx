import { totalPayment } from '@/api-services/payment/totalPayment'
import { getUserServer } from '@/lib/user';
import { redirect } from 'next/navigation';
import React from 'react'
import { getTotalRefund } from '@/api-services/refund/getTotalRefund';
import { getTotalOrderRefund } from '@/api-services/order-refund/getTotalOrderRefund';
import { getTotalExpense } from '@/api-services/expense/getTotalExpense';
import SaleSummaryTable from './saleSummaryTable';

export default async function SaleSummary({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''

    const user = getUserServer();

    const allowedRoles = new Set(["super_admin", "admin", "store_incharge", "salesman"]);
    if (!allowedRoles.has(user!?.role)) {
        redirect("/");
    }

    const totalSalePaymentPromise = totalPayment(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&sell[exists]=true`);
    const totalSaleRefundPromise = getTotalOrderRefund(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}`);

    const [
        totalSalePayment,
        totalSaleRefund,
    ] = await Promise.all([
        totalSalePaymentPromise,
        totalSaleRefundPromise,
    ])

    return (
        <SaleSummaryTable
            salePayment={totalSalePayment?.data}
            saleReturn={totalSaleRefund?.data}
            startDate={startDate}
            endDate={endDate}
        />
    )
}
