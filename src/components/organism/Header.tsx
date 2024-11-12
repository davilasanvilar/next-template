'use client'

import { signOut, useSession } from "next-auth/react";

export function Header() {

    const session = useSession();
    return (
        <header className=" justify-end gap-5 flex p-4">
            <h1>{`HELLO, ${session.data?.user.name}`}</h1>
            <button onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}>{"LOGOUT"}</button>
        </header>
    )
}