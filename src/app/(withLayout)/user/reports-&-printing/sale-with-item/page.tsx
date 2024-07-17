import React from 'react'
import { getAllOrders } from '@/api-services/order/getAllOrders';
import SellWithItemTable from './sellWithItemTable';

export default async function SalesRefund({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''

    const { data } = await getAllOrders(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&fields=createdAt createdBy.name BILLID customer.contactNo total received due items.unit items.quantity items.productDetails`);

    return (
        <SellWithItemTable sales={data} startDate={startDate} endDate={endDate} />
    )
}
