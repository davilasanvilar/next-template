'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';


export function Search() {
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [keyword, setKeyword] = useState('')

    useEffect(() => {
        const timeout = setTimeout(() => {
            setNewKeyword()
        }, 1000)
        return () => {
            clearTimeout(timeout)
        }
    }, [keyword])



    const setNewKeyword = () => {
        const params = new URLSearchParams(searchParams.toString())
        if (keyword === '') {
            params.delete("keyword")
        } else {
            params.set("keyword", keyword)
        }
        router.push(`${pathName}?${params.toString()}`)
    }

    return (
        <div className='w-36 flex justify-between'>
            <input className='border-black border' type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
    )
}