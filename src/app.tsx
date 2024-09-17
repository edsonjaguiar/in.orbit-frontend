import { useQuery } from '@tanstack/react-query'
import { Suspense, lazy } from 'react'
import { CreateGoal } from './components/create-goal'
import { EmptyGoals } from './components/empty-goals'
import { Dialog } from './components/ui/dialog'
import { getSummary } from './http/get-summary'

const LazyLoadedSummary = lazy(() =>
    import('./components/summary').then(module => ({ default: module.Summary }))
)

export function App() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['summary'],
        queryFn: getSummary,
        staleTime: 1000 * 60,
    })

    return (
        <Dialog>
            {isLoading ? (
                <LoadingPlaceholder />
            ) : isError ? (
                <EmptyGoals />
            ) : data && data.total > 0 ? (
                <Suspense fallback={<LoadingPlaceholder />}>
                    <LazyLoadedSummary />
                </Suspense>
            ) : (
                <EmptyGoals />
            )}

            <CreateGoal />
        </Dialog>
    )
}

function LoadingPlaceholder() {
    return (
        <p className="flex items-center h-screen justify-center">
            Carregando suas metas...
        </p>
    )
}
