import type { Metadata } from '@reown/appkit/react'
import { chains, transports } from './chains'
import { config } from '../constants/config'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

const metadata: Metadata = {
	name: 'Concero',
	description: 'Concero',
	url: config.CONCERO_DOMAIN_URL,
	icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

export const adapter = new WagmiAdapter({
	networks: chains,
	transports,
	projectId: config.WEB3_MODAL_PROJECT_ID,
})

createAppKit({
	adapters: [adapter],
	networks: chains,
	metadata,
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
