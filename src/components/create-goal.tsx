import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createGoal } from '../http/create-goal'
import { Button } from './ui/button'
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
    RadioGroup,
    RadioGroupIndicator,
    RadioGroupItem,
} from './ui/radio-group'

const createGoalForm = z.object({
    title: z
        .string()
        .min(1, 'Informe a atividade que deseja realizar')
        .max(35, 'Deve conter no máximo 35 carácteres'),
    desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalForm = z.infer<typeof createGoalForm>

export function CreateGoal() {
    const queryClient = useQueryClient()

    const { register, control, handleSubmit, formState, reset } =
        useForm<CreateGoalForm>({
            resolver: zodResolver(createGoalForm),
        })

    async function handleCreateGoal(data: CreateGoalForm) {
        await createGoal({
            title: data.title,
            desiredWeeklyFrequency: data.desiredWeeklyFrequency,
        })

        queryClient.invalidateQueries({ queryKey: ['summary'] })
        queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

        reset()
    }

    return (
        <DialogContent>
            <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Cadastrar meta</DialogTitle>
                        <DialogClose>
                            <X className="size-5 text-zinc-600" />
                        </DialogClose>
                    </div>

                    <DialogDescription>
                        Adicione atividades que{' '}
                        <span className="underline">te fazem bem</span> e que
                        você quer continuar praticando toda semana.
                    </DialogDescription>
                </div>

                <motion.form
                    onSubmit={handleSubmit(handleCreateGoal)}
                    className="flex-1 flex flex-col justify-between"
                    initial={{ opacity: 0, y: 50 }} // Começa fora da tela
                    animate={{ opacity: 1, y: 0 }} // Anima para a posição original
                    transition={{ duration: 0.4 }} // Controla a duração da animação
                >
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title">Qual a atividade?</Label>
                            <Input
                                id="title"
                                autoFocus
                                placeholder="Praticar exercícios, meditar, etc..."
                                {...register('title')}
                                onChange={e => {
                                    if (e.target.value.length <= 35) {
                                        register('title').onChange(e)
                                    }
                                }}
                            />
                            {formState.errors.title && (
                                <p className="text-red-400 text-sm">
                                    {formState.errors.title.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title">
                                Quantas vezes na semana?
                            </Label>
                            <Controller
                                control={control}
                                name="desiredWeeklyFrequency"
                                defaultValue={3}
                                render={({ field }) => {
                                    return (
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={String(field.value)}
                                        >
                                            <RadioGroupItem value="1">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    1x na semana
                                                </span>
                                                <span className="text-lg leading-none">
                                                    🥱
                                                </span>
                                            </RadioGroupItem>
                                            <RadioGroupItem value="2">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    2x na semana
                                                </span>
                                                <span className="text-lg leading-none">
                                                    🙂
                                                </span>
                                            </RadioGroupItem>
                                            <RadioGroupItem value="3">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    3x na semana
                                                </span>
                                                <span className="text-lg leading-none">
                                                    😎
                                                </span>
                                            </RadioGroupItem>
                                            <RadioGroupItem value="4">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    4x na semana
                                                </span>
                                                <span className="text-lg leading-none">
                                                    😜
                                                </span>
                                            </RadioGroupItem>
                                            <RadioGroupItem value="5">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    5x na semana
                                                </span>
                                                <span className="text-lg leading-none">
                                                    🤨
                                                </span>
                                            </RadioGroupItem>
                                            <RadioGroupItem value="6">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    6x na semana
                                                </span>
                                                <span className="text-lg leading-none">
                                                    🤯
                                                </span>
                                            </RadioGroupItem>
                                            <RadioGroupItem value="7">
                                                <RadioGroupIndicator />
                                                <span className="text-zinc-300 text-sm font-medium leading-none">
                                                    Todos dias da semana
                                                </span>
                                                <span className="text-lg leading-none">
                                                    🔥
                                                </span>
                                            </RadioGroupItem>
                                        </RadioGroup>
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                className="flex-1"
                                variant="secondary"
                            >
                                Fechar
                            </Button>
                        </DialogClose>
                        <Button className="flex-1">Salvar</Button>
                    </div>
                </motion.form>
            </div>
        </DialogContent>
    )
}
