"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Image from 'next/image';
import notFound from '../../public/404-2.png'
import plugDisconnect from '../../public/plug-disconnect.png'
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
    }, [error]);
    return (
        <div className='bg-[#E5E7EB] grid min-h-screen place-items-center'>
            <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
                <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
                    <div className="relative">
                        <div className="absolute">
                            <div className="">
                                <h1 className="my-2 text-gray-800 font-bold text-2xl">
                                    Something went wrong
                                </h1>
                                <p className="my-2 text-gray-800">Sorry about that! Please visit our hompage and try again.</p>
                                <Link href={`/`} className="sm:w-full inline-block lg:w-auto my-2 mr-4 border rounded md py-4 px-8 text-center bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">Back to home!</Link>
                                <button className="sm:w-full lg:w-auto my-2 border border-red-500 rounded md py-4 px-8 text-center bg-red-200 text-red-800 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 font-medium" onClick={
                                    // Attempt to recover by trying to re-render the segment
                                    () => reset()
                                }>Try again!</button>
                            </div>
                        </div>
                        <div>
                            <Image src={notFound} alt='not found' />
                        </div>
                    </div>
                </div>
                <div>
                    <Image src={plugDisconnect} alt='plug disconnect' priority={false} />
                </div>
            </div>
        </div>
    );
}
