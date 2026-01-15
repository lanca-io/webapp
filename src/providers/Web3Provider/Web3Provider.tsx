import type { AppKitNetwork } from '@reown/appkit/networks'
import type { Transport, PublicClient } from 'viem'
import type { ConceroChain } from '../../store/chains/types'
import { AppKit, createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createTransports, convertToViemChains } from '@/utils/chains'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useLoadChains } from '../../hooks/Loadables/useLoadChains'
import { WagmiProvider } from 'wagmi'
import { config } from '../../constants/config'
import { ScreenLoader } from '@/components/common/ScreenLoader/ScreenLoader'
import { getPublicClient as getWagmiPublicClient } from '@wagmi/core'

let adapter: WagmiAdapter | null = null
let appKit: AppKit | null = null

export function initializeAppKit(
	chains: ConceroChain[],
	transports: Record<number, Transport>,
) {
	if (appKit) return { adapter, appKit }

	const viemChains = convertToViemChains(chains)

	adapter = new WagmiAdapter({
		networks: viemChains,
		transports,
		projectId: config.WEB3_MODAL_PROJECT_ID,
	})

	appKit = createAppKit({
		adapters: [adapter],
		networks: viemChains as [AppKitNetwork, ...AppKitNetwork[]],
		metadata: {
			name: 'Concero',
			description: 'Concero',
			url: config.CONCERO_DOMAIN_URL,
			icons: ['https://avatars.githubusercontent.com/u/37784886'],
		},
		projectId: config.WEB3_MODAL_PROJECT_ID,

		enableWalletGuide: true,
		features: {
			send: false,
			socials: false,
			analytics: true,
			email: false,
			onramp: false,
			swaps: false,
			legalCheckbox: true,
		},
	})

	return { adapter, appKit }
}

export function getPublicClient(chainId: number): PublicClient {
	if (!adapter) {
		throw new Error('Adapter is not initialized')
	}
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
			const { adapter } = initializeAppKit(chains, transports)
			setAdapter(adapter)
		}
	}, [chains, adapter])

	if (loading || !adapter || chains.length === 0) {
		return <ScreenLoader />
	}

	return (
		<WagmiProvider config={adapter.wagmiConfig as any}>
			{children}
		</WagmiProvider>
	)
}
