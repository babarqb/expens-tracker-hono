import {createFileRoute} from '@tanstack/react-router'
import {api} from "@/lib/api";
import {useQuery} from "@tanstack/react-query";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button.tsx";

export const Route = createFileRoute('/_authenticated/profile')({
    component: TotalSpent
})

async function getUserProfile() {
    const res = await api.me.$get();
    if (!res.ok) {
        throw new Error('Failed to fetch total spent')
    }
    const data = await res.json();
    return data;
}

function TotalSpent() {
    // const {isPending,isFetching,data, error,isLoading} = useQuery('get-total-spent', getTotalSpent)
    const {isPending,error, data} = useQuery({queryKey: ['get-user-profile'], queryFn: getUserProfile})
    if (isPending) return "Loading....";
    if(error) return "not logged in"
    return (
        <>
            <Avatar>
                <AvatarImage src={data?.user.picture || ""}/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <pre>
         {JSON.stringify(data, null, 2)}
        </pre>
            <Button asChild>
                <a href="/api/logout">Logout</a>
            </Button>
        </>
    )
}
