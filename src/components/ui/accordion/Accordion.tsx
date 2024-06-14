'use client'

import cn from '@/lib/cn';
import React, { useState } from 'react'

export default function Accordion(
    {
        items,
        defaultOpenIndex,
        className,
        itemClassName,
        headingClassName,
        contentClassName,
        icon = 'plus-minus',
    }: {
        items: { title: any, content: any }[],
        defaultOpenIndex?: number,
        className?: string,
        itemClassName?: string,
        headingClassName?: string,
        contentClassName?: string,
        activeClass?: string,
        icon?: false | 'arrow' | 'plus-minus'
    }) {
    const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

    const handleItemClick = (index: any) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    return (
        <div className={className}>
            {items.map((item, index) => (
                <div key={index} className={cn(
                    "border border-gray-300 mb-2",
                    itemClassName
                )}>
                    <div
                        className="cursor-pointer"
                        onClick={() => handleItemClick(index)}
                    >
                        <div className={cn(
                            "flex justify-between items-center p-2  font-medium text-gray-900",
                            headingClassName,
                            {
                                'bg-gray-100 shadow': openIndex === index,
                            }
                        )}>
                            <span>{item.title}</span>
                            {
                                icon &&
                                    icon === 'plus-minus' ?
                                    <span>
                                        {openIndex === index ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                            </svg>

                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                            </svg>
                                        }
                                    </span>
                                    :
                                    <span>
                                        {openIndex === index ?
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                            </svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        }
                                    </span>
                            }
                        </div>
                    </div>
                    {openIndex === index && (
                        <div className={cn(
                            "p-2",
                            contentClassName
                        )}>{item.content}</div>
                    )}
                </div>
            ))}
        </div>
    )
}
