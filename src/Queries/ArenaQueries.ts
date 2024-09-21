import { useQuery } from '@tanstack/vue-query'
import { BASE_BACKEND_URL } from './constants'

export function useRandomWords() {
    return useQuery({
        queryKey: ['randomWords'],
        queryFn: async () => {
            const res = await fetch(`${BASE_BACKEND_URL}/api/TypingArena/RandomWords`)

            if (!res.ok) {
                throw new Error('Some Error Occured')
            }

            const jsonRes = await res.json()
            return jsonRes
        },
        select: (res: any) => res.join(' ')
    })
}
