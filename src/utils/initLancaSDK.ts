import { LancaClient, type LancaClientConfig } from 'lanca-sdk-demo'

const config: LancaClientConfig = {
	chains: {
		8453: ['https://base-rpc.publicnode.com', 'https://rpc.ankr.com/base'],
		42161: ['https://arbitrum-one-rpc.publicnode.com', 'https://rpc.ankr.com/arbitrum'],
		137: ['https://rpc.ankr.com/polygon', 'https://polygon-bor-rpc.publicnode.com'],
		43114: ['https://avalanche-c-chain-rpc.publicnode.com', 'https://rpc.ankr.com/avalanche'],
	},
}

export const lanca = new LancaClient(config)
