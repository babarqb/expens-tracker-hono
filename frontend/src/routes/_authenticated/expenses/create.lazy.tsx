import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button.tsx";
import {useForm} from '@tanstack/react-form'
import {api} from "@/lib/api.ts";


export const Route = createLazyFileRoute('/_authenticated/expenses/create')({
    component: CreateExpense
})

function CreateExpense() {
    const navigate = useNavigate()
    const form = useForm({
        defaultValues: {
            title: '',
            amount: "0",
        },
        onSubmit: async ({value}) => {
            await new Promise(r => setTimeout(r,3000))
            const res = await api.expenses.$post({json: value});
            if (!res.ok) {
                throw new Error('Failed to create expense')
            }
            navigate({to:'/expenses'})
        },
    })
    return (
        <>
            <div className="w-[600px] m-auto ">
                <h2 className="py-2">Create Expense</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }} className="space-y-4">
                    <div>
                        <form.Field
                            name="title"
                            children={(field) => (
                                <>
                                    <Label htmlFor={field.name}>Title</Label>
                                    <Input
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        type="text"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.touchedErrors ? (
                                        <em>{field.state.meta.touchedErrors}</em>
                                    ) : null}
                                </>
                            )}
                        />
                    </div>
                    <div>
                        <form.Field
                            name="amount"
                            children={(field) => (
                                <>
                                    <Label htmlFor={field.name}>Amount</Label>
                                    <Input
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        type="number"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.touchedErrors ? (
                                        <em>{field.state.meta.touchedErrors}</em>
                                    ) : null}
                                </>
                            )}
                        />
                    </div>
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <Button type="submit" disabled={!canSubmit}>
                                {isSubmitting ? '...' : 'Create Expense'}
                            </Button>
                        )}
                    />
                </form>
            </div>
        </>
    )
}
