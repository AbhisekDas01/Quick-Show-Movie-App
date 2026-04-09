import Link from 'next/link';
import { assets } from '@/lib/assets';

const AdminNavbar = () => {
    return (
        <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30'>
            <Link href='/'>
                <img src={assets.logo} alt='logo' className='w-36 h-auto' />
            </Link>
        </div>
    );
};

export default AdminNavbar;
