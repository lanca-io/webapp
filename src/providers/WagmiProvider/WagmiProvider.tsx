import type { FC, PropsWithChildren } from 'react'
import { WagmiProvider as Wagmi } from 'wagmi'
import { adapter } from '../../configuration/wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../../constants/query'

export const WagmiProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	return (
		<Wagmi config={adapter.wagmiConfig} reconnectOnMount={true}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</Wagmi>
	)
}
