import './App.css'
import {
    Card,
    CardContent, CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {useEffect, useState} from "react";

function App() {
    const [totalSpent, setTotalSpent] = useState(0);
    useEffect(() => {
        async function fetchExpenses() {
            const res = await fetch('/api/expenses/total-spents');
            const {total} = await res.json();
            setTotalSpent(total)
        }
        fetchExpenses();
    }, []);
    return (
        <>
            <Card className="w-[350px] m-auto">
                <CardHeader>
                    <CardTitle>Total Expenses</CardTitle>
                    <CardDescription>The total amount you've spent</CardDescription>
                </CardHeader>
                <CardContent>{totalSpent}</CardContent>
            </Card>
        </>
    )
}

export default App
