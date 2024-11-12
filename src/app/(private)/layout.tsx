import { Header } from '@/components/organism/Header';
import { PrivateAreaWrapper } from '@/components/organism/PrivateAreaWrapper';
import React from 'react';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {

    return (
        // <PrivateAreaWrapper>
        <>
            <Header />
            <main className="min-h-full flex-col md:h-auto md:min-h-full max-w-80 m-auto 
             w-full p-4 flex h-screen backdrop-blur-sm items-center justify-center">
                {children}
            </main>
        </>
        // </PrivateAreaWrapper>
    )
}