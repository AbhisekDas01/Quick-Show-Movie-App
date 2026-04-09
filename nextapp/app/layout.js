export const metadata = {
    title: 'QuickShow',
    description: 'Movie ticket booking app',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
