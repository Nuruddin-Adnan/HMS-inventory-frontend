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

    const { data } = await getAllRefunds(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&sell[exists]=true`);

    return (
        <RefundWiseSalesItem refunds={data} startDate={startDate} endDate={endDate} />
    )
}
