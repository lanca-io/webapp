import { useRef, type ReactElement } from 'react'
import { Config, createConfig, WagmiProvider, http } from 'wagmi'
import { arbitrum } from 'viem/chains'
import { useChainsStore } from '@/store/chains/useChainsStore'
import { useSyncWagmiConfig } from '@/hooks/useSyncWagmi'
import { useLoadChains } from '@/hooks/Loadables/useLoadChains'
import { config } from '@/constants/config'
import { AppKit } from '@reown/appkit'

// todo: sync appkit in a way that it works with wagmi!

const metadata = {
	name: 'Concero',
	description: 'Concero',
	url: config.CONCERO_DOMAIN_URL,
	icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

let appKit: AppKit | null = null

export const WalletProvider: React.FC<React.PropsWithChildren> = ({
	children,
}): ReactElement => {
	useLoadChains()
	const { chains } = useChainsStore()
	const wagmi = useRef<Config | null>(null)

	if (!wagmi.current) {
		wagmi.current = createConfig({
			chains: [arbitrum],
			ssr: true,
			transports: {
				[arbitrum.id]: http(),
			},
		})
	}

	useSyncWagmiConfig(wagmi.current, Object.values(chains))

	return (
		<WagmiProvider config={wagmi.current} reconnectOnMount={false}>
			{children}
		</WagmiProvider>
	)
}
