import React from 'react'
import { getAllOrderRefunds } from '@/api-services/order-refund/getAllOrderRefunds';
import SaleRefundAmountWiseTable from './saleRefundAmountWiseTable';

export default async function SalesRefundAmountWise({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''

    const { data } = await getAllOrderRefunds(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}`);

    return (
        <SaleRefundAmountWiseTable refunds={data} startDate={startDate} endDate={endDate} />
    )
}
