'use client';

import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ScreenProvider } from '@/providers/ScreenProvider';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import React from 'react';

export function Providers({ session, children }: { session: Session | null, children: React.ReactNode }) {

    return (
        <SessionProvider session={session}>
            <ScreenProvider>
                <ReactQueryProvider>
                    {children}
                </ReactQueryProvider>
            </ScreenProvider>
        </SessionProvider>
    );
}