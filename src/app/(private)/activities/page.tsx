import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ActivityCreator } from "@/components/molecules/ActivityCreator";
import { Pagination } from "@/components/molecules/Pagination";
import { Search } from "@/components/molecules/Search";
import { ActivitiesTable } from "@/components/organism/ActivitiesTable";
import { crud } from "@/crud";
import { Activity } from "@/types/entities";
import { ApiError } from "@/types/types";
import { getServerSession } from "next-auth";
import { Suspense } from "react";


interface ActivitiesSearchParams {
    keyword?: string;
    page: string;
}


export default async function ActivitiesPage({ searchParams }: { searchParams: ActivitiesSearchParams }) {
    const { searchMetadata } = crud<Activity>('activity');
    const page = Number.parseInt(searchParams.page || '1');
    const keyword = searchParams.keyword || '';
    const session = await getServerSession(authOptions);
    const pageMetadata = await searchMetadata(page, 5, { name: keyword }, session?.user.authToken ?? '');


    return (
        <>
            <h2 className="mt-4">{"My activities"}</h2>
            <Search />
            <Suspense key={searchParams.keyword + searchParams.page} fallback={<div>Loading...</div>}>
                <ActivitiesTable query={{ keyword, page }} />
            </Suspense>
            < Pagination maxPage={pageMetadata.totalPages} />
            <ActivityCreator />
        </>
    );
}