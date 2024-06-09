import {createFileRoute, Outlet} from '@tanstack/react-router'
import {Button} from "@/components/ui/button.tsx";
import {userQueryOptions} from "@/lib/api";
const Login = () => {
    return (
           <div className="flex flex-col gap-y-2 items-center" >
               <p>You have to login or register</p>
               <Button asChild>
                     <a href="/api/login">Login</a>
               </Button>
               <Button asChild>
                   <a href="/api/register">Register</a>
               </Button>
           </div>
    )
}

const Component = () => {
    const {user} = Route.useRouteContext()
    if(!user) return <Login />
    return <Outlet/>
}

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({context}) => {
        const queryClient = context.queryClient;
        try{
            return await queryClient.fetchQuery(userQueryOptions)
        }catch (e){
            return {user:null}
        }
    },
    component: Component
})

