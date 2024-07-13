import React from 'react'
import SaleTable from './saleTable';
import { getAllOrders } from '@/api-services/order/getAllOrders';

export default async function Sale({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''

    const { data } = await getAllOrders(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}`);

    return (
        <SaleTable sales={data} startDate={startDate} endDate={endDate} />
    )
}
