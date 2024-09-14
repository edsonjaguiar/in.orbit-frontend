import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Plus } from 'lucide-react'
import { useDeleteGoalCompletion } from '../http/delete-goal-completion'
import { getSummary } from '../http/get-summary'
import { InOrbitIcon } from './in-orbit-icon'
import { PendingGoals } from './pending-goals'
import { Button } from './ui/button'
import { DialogTrigger } from './ui/dialog'
import { Progress, ProgressIndicator } from './ui/progress-bar'
import { Separator } from './ui/separator'

dayjs.locale(ptBR)

export function Summary() {
    const { data } = useQuery({
        queryKey: ['summary'],
        queryFn: getSummary,
        staleTime: 1000 * 60,
    })

    if (!data) {
        return null
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: -20, opacity: 0 },
    }

    const goalVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: 20, opacity: 0 },
    }

    const firstDayOfWeek = dayjs().startOf('week').format('DD')
    const lastDayOfWeek = dayjs().endOf('week').format('DD')
    const month = dayjs().format('MMMM')

    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)
    const formattedDate = `${firstDayOfWeek} a ${lastDayOfWeek} de ${capitalizedMonth}`

    const completedPercentage = Math.round((data.completed * 100) / data.total)

    const { mutate: deleteGoal } = useDeleteGoalCompletion()

    async function handleDeleteGoal(completedId: string) {
        deleteGoal(completedId)
    }

    const progressIndicatorStyle = {
        width: `${completedPercentage}%`,
        transition: 'width 0.5s ease',
    }

    return (
        <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <InOrbitIcon />
                    <span className="text-lg font-semibold">
                        {formattedDate}
                    </span>
                </div>

                <DialogTrigger asChild>
                    <Button>
                        <Plus className="size-4" />
                        Cadastrar meta
                    </Button>
                </DialogTrigger>
            </div>

            <div className="flex flex-col gap-3">
                <Progress value={8} max={15}>
                    <ProgressIndicator style={progressIndicatorStyle} />
                </Progress>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>
                        Você completou{' '}
                        <span className="text-zinc-100 truncate">
                            {data?.completed}
                        </span>{' '}
                        de <span className="text-zinc-100">{data?.total}</span>{' '}
                        metas nessa semana.
                    </span>
                    <span>{completedPercentage}%</span>
                </div>
            </div>

            <Separator />

            <PendingGoals />

            <motion.div
                className="flex flex-col gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h2 className="text-xl font-medium">Sua semana</h2>
                <AnimatePresence>
                    {data.goalsPerDay ? (
                        Object.entries(data.goalsPerDay).map(
                            ([date, goals]) => {
                                const weekDay = dayjs(date).format('dddd')
                                const formattedDate =
                                    dayjs(date).format('D[ de ]MMMM')

                                return (
                                    <motion.div
                                        key={date}
                                        className="flex flex-col gap-4"
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <motion.h3
                                            className="font-medium"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <span className="capitalize">
                                                {weekDay}
                                            </span>{' '}
                                            <span className="text-zinc-400 text-xs">
                                                ({formattedDate})
                                            </span>
                                        </motion.h3>

                                        <ul className="flex flex-col gap-3">
                                            <AnimatePresence>
                                                {goals.map(goal => {
                                                    const time = dayjs(
                                                        goal.completedAt
                                                    ).format('HH:mm')

                                                    return (
                                                        <motion.li
                                                            key={goal.id}
                                                            className="flex flex-wrap items-start gap-2 py-2"
                                                            variants={
                                                                goalVariants
                                                            }
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            layout
                                                        >
                                                            <CheckCircle2 className="size-4 text-pink-500 flex-shrink-0 mt-1" />
                                                            <span className="text-sm text-zinc-400">
                                                                Você completou "
                                                                <span
                                                                    className="text-zinc-100 inline-block max-w-[150px] truncate align-bottom"
                                                                    title={
                                                                        goal.title
                                                                    }
                                                                >
                                                                    {goal.title}
                                                                </span>
                                                                " às{' '}
                                                                <span className="text-zinc-100">
                                                                    {time}h
                                                                </span>
                                                                <motion.button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteGoal(
                                                                            goal.id
                                                                        )
                                                                    }
                                                                    className="text-zinc-500 underline text-sm px-2"
                                                                    whileHover={{
                                                                        scale: 1.05,
                                                                    }}
                                                                    whileTap={{
                                                                        scale: 0.95,
                                                                    }}
                                                                >
                                                                    Desfazer
                                                                </motion.button>
                                                            </span>
                                                        </motion.li>
                                                    )
                                                })}
                                            </AnimatePresence>
                                        </ul>
                                    </motion.div>
                                )
                            }
                        )
                    ) : (
                        <motion.p
                            className="text-zinc-400 text-sm"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Você ainda não completou nenhuma meta essa semana.
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
