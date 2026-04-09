'use client';

import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from '@/context/AppContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');

    return (
        <AppProvider>
            <Toaster />
            {!isAdminRoute && <Navbar />}
            {children}
            {!isAdminRoute && <Footer />}
        </AppProvider>
    );
}
