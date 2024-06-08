import {createLazyFileRoute} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/api.ts";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Skeleton} from "@/components/ui/skeleton"

export const Route = createLazyFileRoute('/expenses/')({
    component: AllExpenses
})

async function getAllExpenses() {
    //fake loading
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    const res = await api.expenses.$get();
    if (!res.ok) {
        throw new Error('Failed to fetch all expenses')
    }
    const data = await res.json();
    return data;
}

function AllExpenses() {
    // const {isPending,isFetching,data, error,isLoading} = useQuery('get-total-spent', getTotalSpent)
    const {isPending, data} = useQuery({queryKey: ['get-all-expenses'], queryFn: getAllExpenses})
    return (
        <>
            <div className="p-2 m-auto max-w-3xl">
                <Table>
                    <TableCaption>A list of your recent expenses.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Id</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {isPending ? Array(3).fill(0).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium"><Skeleton className="h-4"/></TableCell>
                                    <TableCell className="font-medium"><Skeleton className="h-4"/></TableCell>
                                    <TableCell className="font-medium"><Skeleton className="h-4"/></TableCell>
                                </TableRow>
                            )) : data?.expenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell className="font-medium">{expense.id}</TableCell>
                                        <TableCell>{expense.title}</TableCell>
                                        <TableCell className="text-right">${expense.amount}</TableCell>
                                    </TableRow>
                                )
                            )}
                        </>
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
