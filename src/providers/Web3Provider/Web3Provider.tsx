import type { AppKitNetwork } from '@reown/appkit/networks'
import type { Transport, PublicClient } from 'viem'
import type { ConceroChain } from '../../store/chains/types'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { convertToViemChains, createTransports } from '../../utils/new/chains'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useLoadChains } from '../../hooks/Loadables/useLoadChains'
import { WagmiProvider } from 'wagmi'
import { config } from '../../constants/config'
import { FullScreenLoader } from '../../components/layout/FullScreenLoader/FullScreenLoader'
import { TechWorksScreen } from '../../components/screens/TechWorksScreen/TechWorksScreen'
import { getPublicClient as getWagmiPublicClient } from '@wagmi/core'

const metadata = {
	name: 'Concero',
	description: 'Concero',
	url: config.CONCERO_DOMAIN_URL,
	icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const appKitFeatures = {
	send: false,
	socials: false,
	analytics: true,
	email: false,
	onramp: false,
	swaps: false,
	activity: false,
	legalCheckbox: true,
} as const

let wagmiAdapter: WagmiAdapter | null = null
let appKit: ReturnType<typeof createAppKit> | null = null

export function initializeAppKit(
	chains: ConceroChain[],
	transports: Record<number, Transport>,
) {
	if (appKit) return { wagmiAdapter, appKit }

	const viemChains = convertToViemChains(chains)

	wagmiAdapter = new WagmiAdapter({
		networks: viemChains,
		transports,
		projectId: config.WEB3_MODAL_PROJECT_ID,
	})

	appKit = createAppKit({
		adapters: [wagmiAdapter],
		networks: viemChains as [AppKitNetwork, ...AppKitNetwork[]],
		metadata,
		projectId: config.WEB3_MODAL_PROJECT_ID,
		enableWalletGuide: true,
		features: appKitFeatures,
	})

	return { wagmiAdapter, appKit }
}

export function getWagmiAdapter() {
	if (!wagmiAdapter) throw new Error('AppKit not initialized')
	return wagmiAdapter
}

export function getPublicClient(chainId: number): PublicClient {
	const adapter = getWagmiAdapter()
	const client = getWagmiPublicClient(adapter.wagmiConfig, { chainId })

	if (!client) {
		throw new Error(`Public client for chain ${chainId} could not be created`)
	}

	return client
}

export const Web3Provider: FC<PropsWithChildren> = ({ children }) => {
	const { chains, loading } = useLoadChains()
	const [adapter, setAdapter] = useState<WagmiAdapter | null>(null)

	useEffect(() => {
		if (chains.length > 0 && !adapter) {
			const transports = createTransports(chains)
			const { wagmiAdapter } = initializeAppKit(chains, transports)
			setAdapter(wagmiAdapter)
		}
	}, [chains, adapter])

	if (loading) {
		return <FullScreenLoader />
	}

	if (!adapter || chains.length === 0) {
		return <TechWorksScreen />
	}

	return (
		<WagmiProvider config={adapter.wagmiConfig as any}>
			{children}
		</WagmiProvider>
	)
}
