import React from 'react'
import { getAllOrders } from '@/api-services/order/getAllOrders';
import SaleWithItemTable from './saleWithItemTable';

export default async function SalesRefund({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllOrders(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&page=${page}&limit=${limit}&fields=createdAt createdBy.name BILLID customer.contactNo total received due items.unit items.quantity items.productDetails`);

    return (
        <SaleWithItemTable sales={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
