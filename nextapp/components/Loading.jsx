'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const Loading = () => {
    const params = useParams();
    const router = useRouter();
    const nextUrl = params?.nextUrl;

    useEffect(() => {
        if (nextUrl) {
            const randomTime = Math.floor(Math.random() * 8000);
            const timer = setTimeout(() => {
                router.push('/' + nextUrl);
            }, randomTime);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className='flex justify-center items-center h-[80vh]'>
            <div className='animate-spin rounded-full h-14 w-14 border-2 border-t-Primary' />
        </div>
    );
};

export default Loading;
