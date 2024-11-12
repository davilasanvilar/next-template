import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { crud } from '@/crud';
import { Activity } from '@/types/entities';
import { ApiError } from '@/types/types';
import { getServerSession } from 'next-auth';
import React from 'react';
import { Pagination } from '../molecules/Pagination';


interface ActivitiesSearchQuery {
    keyword: string;
    page: number;
}

export async function ActivitiesTable({ query }: { query: ActivitiesSearchQuery }) {
    const session = await getServerSession(authOptions);
    const { search } = crud<Activity>('activity');

    try {
        const activities = await search(query.page-1, 5, { name: query.keyword }, session?.user.authToken ?? '');
        return (
            <>
                {activities.map(activity => (
                    <div className="w-full" key={activity.id}>
                        <h3>{activity.name}</h3>
                        <p>{activity.description}</p>
                    </div>
                ))}
            </>
        )
    } catch (e) {
        if (e instanceof ApiError) {
            console.log(e)
        }
    }
}
