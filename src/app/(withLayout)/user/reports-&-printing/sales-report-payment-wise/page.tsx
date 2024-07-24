import React from 'react'
import SalesReportPaymentWiseTable from './salesReportPaymentWiseTable';
import { getAllPayments } from '@/api-services/payment/getAllPayments';

export default async function SalesReportPaymentWise({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllPayments(`createdAt[gte]=${startDate}&createdAt[lte]=${endDate}&page=${page}&limit=${limit}&sell[exists]=true&fields=-purchase`);

    return (
        <SalesReportPaymentWiseTable payments={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
