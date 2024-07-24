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
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllOrderRefunds(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&page=${page}&limit=${limit}`);

    return (
        <SaleRefundAmountWiseTable refunds={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
