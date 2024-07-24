import React from 'react'
import ItemWiseSaleTable from './itemWiseSaleTable';
import { getAllOrderItems } from '@/api-services/order-item/getAllOrderItems';

export default async function ItemWiseSale({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllOrderItems(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&page=${page}&limit=${limit}&fields=createdAt createdBy BILLID product unit quantity refundQuantity orderStatus`);

    return (
        <ItemWiseSaleTable salesItems={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
