import React from 'react'
import { getAllOrders } from '@/api-services/order/getAllOrders';
import SaleTable from './saleTable';

export default async function SalesRefund({
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
