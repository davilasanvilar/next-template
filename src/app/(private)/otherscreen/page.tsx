import { api } from '@/api';
import { useEffect } from 'react';

export default async function OtherPage() {
    await api.test()

    return (
        <>
            <h1>Other Screen</h1>
        </>
    );
}
