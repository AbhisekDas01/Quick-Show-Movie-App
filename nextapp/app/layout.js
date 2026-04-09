import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

// All pages are dynamically rendered (live user + movie data, Clerk auth)
export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'QuickShow',
    description: 'Movie ticket booking app',
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body>
                <ClerkProvider>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
                </ClerkProvider>
            </body>
        </html>
    );
}
