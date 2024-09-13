import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { createGoalCompletion } from '../http/create-goal-completion'
import { getPendingGoals } from '../http/get-pending-goals'
import { OutlineButton } from './ui/outline-button'

export function PendingGoals() {
    const queryClient = useQueryClient()

    const { data } = useQuery({
        queryKey: ['pending-goals'],
        queryFn: getPendingGoals,
        staleTime: 1000 * 60,
    })

    if (!data) {
        return null
    }

    async function handleCompleteGoal(goalId: string) {
        await createGoalCompletion(goalId)

        queryClient.invalidateQueries({ queryKey: ['summary'] })
        queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    }

    return (
        <motion.div className="flex flex-wrap gap-3">
            <AnimatePresence initial={false}>
                {data.map(goal => (
                    <motion.div
                        key={goal.id}
                        layout
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                    >
                        <OutlineButton
                            disabled={
                                goal.completionCount >=
                                goal.desiredWeeklyFrequency
                            }
                            onClick={() => handleCompleteGoal(goal.id)}
                        >
                            <Plus className="size-4" />
                            {goal.title}
                        </OutlineButton>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    )
}
