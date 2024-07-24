import React from 'react'
import { getAllOrders } from '@/api-services/order/getAllOrders';
import SaleTable from './saleTable';

export default async function Sale({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllOrders(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&page=${page}&limit=${limit}&fields=createdAt createdBy.name BILLID customer.contactNo subtotal discountPercent vatPercent total received due`);

    return (
        <SaleTable sales={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
