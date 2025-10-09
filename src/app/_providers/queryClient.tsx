import { ReactNode, useState } from 'react'

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'

const QueriesClient = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache: new QueryCache({
					onError: async error => {
						throw error
					}
				}),
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false
					},
					mutations: {
						onError: async error => {
							toast.error('Что-то пошло не так..')
							console.error(error)
						}
					}
				}
			})
	)

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
export default QueriesClient
