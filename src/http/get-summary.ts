type SummaryResponse = {
    completed: number
    total: number
    completionCount: number
    goalsPerDay: Record<
        string,
        {
            id: string
            title: string
            completedAt: string
        }[]
    >
}
import { env } from '../env'

export async function getSummary(): Promise<SummaryResponse> {
    const response = await fetch(`${env.VITE_API_URL}/summary`)
    const data = await response.json()

    return data.summary
}
