import React from 'react'
import { getAllOrders } from '@/api-services/order/getAllOrders';
import SalesRefundTable from './salesRefundTable';

export default async function Sale({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllOrders(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&page=${page}&limit=${limit}&refundTotal[gt]=0&fields=BILLID createdAt customer.contactNo total refundTotal received refundAmount discountAmount due`);

    return (
        <SalesRefundTable sales={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
