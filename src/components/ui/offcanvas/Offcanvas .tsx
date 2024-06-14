'use client'

import cn from '@/lib/cn';
import React from 'react';

const Offcanvas = (
    {
        isOpen = false,
        toggleOffcanvas,
        position = 'left',
        className,
        children
    }: {
        isOpen: boolean,
        toggleOffcanvas: any,
        position?: 'left' | 'right',
        className?: string,
        children: React.ReactNode
    }) => {
    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 overflow-hidden">
                    {/* Offcanvas Content */}
                    <div className={cn(
                        "fixed inset-y-0 left-0 z-40 w-72 bg-white overflow-y-auto transition-transform transform",
                        className,
                        {
                            "right-0 left-auto": position === 'right'
                        }
                    )}>
                        {/* Offcanvas Header */}
                        <div className="p-4 bg-gray-800 text-white flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Offcanvas Logo</h1>
                            <button onClick={toggleOffcanvas} className=" text-gray-300 hover:text-white focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Offcanvas Body */}
                        <div className="p-4">
                            {children}
                        </div>
                    </div>

                    {/* Overlay (click to close) */}
                    <div
                        onClick={toggleOffcanvas}
                        className="fixed inset-0 bg-black opacity-50"
                    />
                </div>
            )}
        </div>
    );
};

export default Offcanvas;
