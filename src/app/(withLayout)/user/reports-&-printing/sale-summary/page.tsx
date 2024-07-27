import { totalPayment } from '@/api-services/payment/totalPayment'
import { getUserServer } from '@/lib/user';
import { redirect } from 'next/navigation';
import React from 'react'
import { getTotalRefund } from '@/api-services/refund/getTotalRefund';
import { getTotalOrderRefund } from '@/api-services/order-refund/getTotalOrderRefund';
import { getTotalExpense } from '@/api-services/expense/getTotalExpense';
import SaleSummaryTable from './saleSummaryTable';
import { getOrderSummary } from '@/api-services/order/getOrderSummary';

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

    const getOrderSummaryPromise = getOrderSummary(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}`);
    const totalSalePaymentPromise = totalPayment(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&sell[exists]=true`);
    const totalSaleRefundPromise = getTotalOrderRefund(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}`);

    const [
        orderSummary,
        totalSalePayment,
        totalSaleRefund,
    ] = await Promise.all([
        getOrderSummaryPromise,
        totalSalePaymentPromise,
        totalSaleRefundPromise,
    ])

    return (
        <SaleSummaryTable
            orderSummary={orderSummary?.data}
            salePayment={totalSalePayment?.data}
            saleRefund={totalSaleRefund?.data}
            startDate={startDate}
            endDate={endDate}
        />
    )
}
