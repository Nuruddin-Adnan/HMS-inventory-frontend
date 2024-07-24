import { totalPayment } from '@/api-services/payment/totalPayment'
import { getUserServer } from '@/lib/user';
import { redirect } from 'next/navigation';
import React from 'react'
import IncomeStatementTable from './incomeStatementTable';
import { getTotalRefund } from '@/api-services/refund/getTotalRefund';
import { getTotalOrderRefund } from '@/api-services/order-refund/getTotalOrderRefund';
import { getTotalExpense } from '@/api-services/expense/getTotalExpense';

export default async function IncomeStatement({
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
    const totalPurchasePaymentPromise = totalPayment(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&purchase[exists]=true`);
    const totalPurchaseRefundPromise = getTotalRefund(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&purchase[exists]=true`);
    const totalExpensePromise = getTotalExpense(`expenseDate[gte]=${startDate}&expenseDate[lte]=${endDate}`);

    const [
        totalSalePayment,
        totalSaleRefund,
        totalPurchasePayment,
        totalPurchaseRefund,
        totalExpense
    ] = await Promise.all([
        totalSalePaymentPromise,
        totalSaleRefundPromise,
        totalPurchasePaymentPromise,
        totalPurchaseRefundPromise,
        totalExpensePromise
    ])

    return (
        <IncomeStatementTable
            salePayment={totalSalePayment?.data}
            saleReturn={totalSaleRefund?.data}
            purchasePayment={totalPurchasePayment?.data}
            purchaseReturn={totalPurchaseRefund?.data}
            expense={totalExpense?.data}
            startDate={startDate}
            endDate={endDate}
        />
    )
}
