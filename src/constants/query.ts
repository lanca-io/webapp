import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			enabled: true,
			refetchInterval: false,
			refetchIntervalInBackground: false,
			refetchOnReconnect: true,
			refetchOnMount: true,
			retryOnMount: true,
		},
	},
})
