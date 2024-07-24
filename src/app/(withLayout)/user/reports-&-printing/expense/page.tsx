import React from 'react'
import ExpenseTable from './expenseTable';
import { getAllExpenses } from '@/api-services/expense/getAllExpenses';

export default async function Expense({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const startDate = searchParams['startDate'] ?? ''
    const endDate = searchParams['endDate'] ?? ''
    const page = searchParams["page"] ?? "1";
    const limit = searchParams["limit"] ?? "1000";

    const { data, meta } = await getAllExpenses(`expenseDate[gte]=${startDate}&expenseDate[lte]=${endDate}&page=${page}&limit=${limit}&fields=expenseDate purpose description createdAt createdBy updatedAt updatedBy amount`);

    return (
        <ExpenseTable expenses={data} startDate={startDate} endDate={endDate} totalPages={meta.total ?? 0} limit={Number(limit)} />
    )
}
