import type { ILancaChain } from '@lanca/sdk'

export type ChainMenuProps = {
	chains: ILancaChain[]
	activeChain: ILancaChain | null
	onChainClick: (chain: ILancaChain) => void
}
