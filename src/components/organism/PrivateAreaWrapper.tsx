'use client'
import { useSession } from 'next-auth/react';
import React, { useEffect, useLayoutEffect } from 'react';

export function PrivateAreaWrapper({ children }: { children: React.ReactNode }) {

    const session = useSession();


    return (
        session && session.data ? (
            <>
                {children}
            </>
        ) : (
            <div>
                <h1>NOT AUTHORIZED</h1>
            </div>
        )
    )
}