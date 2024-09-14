import { useQuery } from '@tanstack/react-query'
import { CreateGoal } from './components/create-goal'
import { EmptyGoals } from './components/empty-goals'
import { Summary } from './components/summary'
import { Dialog } from './components/ui/dialog'
import { getSummary } from './http/get-summary'

export function App() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['summary'],
        queryFn: getSummary,
        staleTime: 1000 * 60,
    })

    return (
        <Dialog>
            {isLoading ? (
                <p className="flex items-center h-screen justify-center">
                    Carregando suas metas...
                </p>
            ) : isError ? (
                <EmptyGoals />
            ) : data && data.total > 0 ? (
                <Summary />
            ) : (
                <EmptyGoals />
            )}

            <CreateGoal />
        </Dialog>
    )
}
