import React from 'react'
import RefundWiseSalesItem from './refundWiseSalesItem';
import { getAllRefunds } from '@/api-services/refund/getAllRefunds';

export default async function SalesRefund({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllRefunds(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&page=${page}&limit=${limit}&sell[exists]=true&fields=createdAt createdBy.name sell.BILLID product.name unit quantity amount`);

    return (
        <RefundWiseSalesItem refunds={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
