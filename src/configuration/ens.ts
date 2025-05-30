import { http, fallback, createPublicClient } from 'viem'
import { mainnet } from 'viem/chains'

const ensTransport = fallback([
	http('https://ethereum-rpc.publicnode.com'),
	http('https://1rpc.io/eth'),
	http('https://eth-pokt.nodies.app'),
	http('https://rpc.mevblocker.io'),
])

export const ensClient = createPublicClient({
	chain: mainnet,
	transport: ensTransport,
})
