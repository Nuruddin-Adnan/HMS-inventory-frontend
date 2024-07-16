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

    const { data } = await getAllOrders(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&refundTotal[gt]=0`);

    return (
        <SalesRefundTable sales={data} startDate={startDate} endDate={endDate} />
    )
}
