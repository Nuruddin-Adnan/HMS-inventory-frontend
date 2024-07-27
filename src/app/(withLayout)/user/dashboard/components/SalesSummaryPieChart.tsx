"use client"
import { sumArrayField } from '@/helpers/sumArrayField';
import React, { useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


export default function SalesSummaryPieChart({
  orderSummaries,
}: {
  orderSummaries: any;
}) {
  const [year, setYear] = useState<number>(new Date().getFullYear())

  // Helper function to get month index
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract years and remove duplicates
  const years = orderSummaries.map((item: any) => item.year);
  const uniqueYears = Array.from(new Set(years));

  const dataByYear = orderSummaries.filter((data: any) => data.year === year)

  const defaultEmptyData = {
    year: dataByYear[0].year,
    sale: 0,
    received: 0,
    due: 0,
    refund: 0,
  };

  const dataWithAllMonth = months.map(month => {
    const existingData = dataByYear.find((item: any) => item.month === month);
    if (existingData) {
      return existingData;
    } else {
      return { month, ...defaultEmptyData };
    }
  });

  const monthIndex = (month: any) => {
    return months.indexOf(month);
  };

  // Sort the array by year ascending and month ascending
  const sortedByYearMonthData = dataWithAllMonth.sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year; // Sort by year ascending
    }
    return monthIndex(a.month) - monthIndex(b.month); // Sort by month ascending
  });

  const totalSalesOfYear = sumArrayField(sortedByYearMonthData, "sale")
  const totalRefundOfYear = sumArrayField(sortedByYearMonthData, "refund")
  const totalReceivedOfYear = sumArrayField(sortedByYearMonthData, "received")
  const totalDueOfYear = sumArrayField(sortedByYearMonthData, "due")

  // make the data to show in the chart
  const data1 = [
    { name: 'sale', value: totalSalesOfYear },
  ]
  const data2 = [
    { name: 'received', value: totalReceivedOfYear },
    { name: 'due', value: totalDueOfYear },
    { name: 'refund', value: totalRefundOfYear },
  ]

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];
  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];



  return (
    <div className='card py-4 '>
      <div className='flex justify-between pb-4 pt-2 px-4 mb-3 border-b'>
        <div className='2xl:text-base text-gray-600 flex text-nowrap gap-10'>
          <p>
            <span className='w-3 h-3 bg-[#008FFB] rounded-full inline-block'></span>
            <span className='inline-block px-2'>Sales</span>
            <span className='font-semibold'>৳{totalSalesOfYear}</span>
          </p>
        </div>
        <div className='2xl:text-base'>
          <label className='font-semibold pr-2 text-gray-700'>Year: </label>
          <select className='border rounded' onChange={(e: any) => setYear(parseInt(e.target.value))} defaultValue={new Date().getFullYear()}>
            {
              uniqueYears.map((year: any) => <option key={year} value={year}>{year}</option>)
            }
          </select>
        </div>
      </div>
      <div>
        <div >
          <ResponsiveContainer width="100%" height={318}>
            <PieChart width={400} height={300}>
              <Pie data={data1} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#0088FE" />
              <Pie
                data={data2}
                cx="50%"
                cy="50%"
                label
                innerRadius={70}
                outerRadius={90}
                fill="#82ca9d"
                dataKey="value"
              >
                {data2.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='text-gray-600 flex  gap-x-5 text-nowrap text-sm justify-center pb-3'>
          <p className='text-[#00C49F]'>
            <span className='w-3 h-3 bg-[#00C49F] rounded-full inline-block'></span>
            <span className='inline-block px-1'>Received</span>
          </p>
          <p className='text-[#FFBB28]'>
            <span className='w-3 h-3 bg-[#FFBB28] rounded-full inline-block'></span>
            <span className='inline-block px-1'>Due</span>
          </p>
          <p className='text-[#FF8042]'>
            <span className='w-3 h-3 bg-[#FF8042] rounded-full inline-block'></span>
            <span className='inline-block px-1'>Refund</span>
          </p>
        </div>
      </div>

    </div>
  )
}
