'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Title from '@/components/admin/Title';
import Loading from '@/components/Loading';
import { dateFormat } from '@/lib/dateFormat';

export default function ListShowsPage() {
    const { axios, getToken, user } = useAppContext();
    const currency = process.env.NEXT_PUBLIC_CURRENCY;

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAllShows = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-shows', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            setShows(data.shows);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user) {
            getAllShows();
        }
    }, [user]);

    return !loading ? (
        <>
            <Title text1='Admin' text2='Shows' />

            <div className='max-w-4xl mt-6 overflow-x-auto'>
                <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
                    <thead>
                        <tr className='bg-Primary/20 text-left text-white'>
                            <th className='p-2 font-medium pl-5'>Movie Name</th>
                            <th className='p-2 font-medium'>Show Time</th>
                            <th className='p-2 font-medium'>Total Booking</th>
                            <th className='p-2 font-medium'>Earning</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm font-light'>
                        {shows.map((show, index) => (
                            <tr key={index} className='border-b border-Primary/10 bg-Primary/5 even:bg-Primary/10'>
                                <td className='p-2 min-w-45 pl-5'>{show.movie.title}</td>
                                <td className='p-2'>{dateFormat(show.showDateTime)}</td>
                                <td className='p-2'>{Object.keys(show.occupiedSeats).length}</td>
                                <td className='p-2'>{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : (
        <Loading />
    );
}
