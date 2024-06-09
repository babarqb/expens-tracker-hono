import { createFileRoute } from '@tanstack/react-router'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {api} from "@/lib/api";
import {useQuery} from "@tanstack/react-query";

export const Route = createFileRoute('/_authenticated/')({
  component: TotalSpent
})
async function getTotalSpent() {
  const res = await api.expenses['total-spent'].$get();
  if (!res.ok) {
    throw new Error('Failed to fetch total spent')
  }
  const data = await res.json();
  return data;
}

function TotalSpent() {
  // const {isPending,isFetching,data, error,isLoading} = useQuery('get-total-spent', getTotalSpent)
  const {isPending,data} = useQuery({queryKey: ['get-total-spent'], queryFn: getTotalSpent})
  return (
      <>
        <Card className="w-[350px] m-auto">
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>The total amount you've spent</CardDescription>
          </CardHeader>
          <CardContent>{isPending ? '....': data && '$'+ data.total}</CardContent>
        </Card>
      </>
  )
}
