'use client';
import { crud } from '@/crud';
import { Activity, ActivityForm } from '@/types/entities';
import { useMutation } from '@tanstack/react-query';
import { getSession, useSession } from 'next-auth/react';
import React, { useState } from 'react';

export function ActivityCreator() {


    const [name, setName] = useState("")
    const [description, setDescription] = useState("")


    const { create } = crud<Activity>('activity',);

    const createNewActivity = async () => {
        const session = await getSession();
        await create({ name, description } as ActivityForm, session?.user.authToken ?? '');
    }

    const { mutate: onCreateActivity } = useMutation({
        mutationFn: createNewActivity,
        onSuccess: () => {
            setName('');
            setDescription('');
            console.log('Activity created');
            // showToast('success', 'The code was succesfully sent!');
        },
        onError: (e) => {
            if (e instanceof Error) {
                // showToast('error', 'Internal error');
                return;
            }
        }
    });

    return (
        <form onSubmit={(e) => { e.preventDefault(); onCreateActivity() }} className='w-52 bg-green-100 p-5 flex flex-col gap-4'>
            <h2 className="font-bold">{"Create a new activity"}</h2>
            <label >
                Name
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                Description
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <button type="submit">Create</button>
        </form>
    )
}