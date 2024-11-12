'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';


export function Pagination({ maxPage }: { maxPage: number }) {
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const page = Number.parseInt(searchParams.get("page") || '1')
   
    const setNewPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`${pathName}?${params.toString()}`)
    }

    return (
        <div className='w-36 flex justify-between'>
            <button disabled={page <= 1} onClick={() => setNewPage(page - 1)}>{"<"}</button>
            <span>{page}</span>
            <button disabled={page >= maxPage} onClick={() => setNewPage(page + 1)}>{">"}</button>
        </div>
    )
}