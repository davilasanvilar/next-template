

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="min-h-full flex-col md:h-auto md:min-h-full w-full p-4 flex h-screen backdrop-blur-sm items-center justify-center">
            {children}
        </main>

    );
}
