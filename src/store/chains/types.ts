import { ILancaChain } from '@lanca/sdk'

export interface ChainsState {
	chains: ILancaChain[]
	isLoading: boolean
	error: string | null
	selectedChain: ILancaChain | null
	setChains: (chains: ILancaChain[]) => void
	clearChains: () => void
	setLoading: (isLoading: boolean) => void
	setError: (error: string) => void
	clearError: () => void
	selectChain: (chain: ILancaChain) => void
	clearSelectedChain: () => void
}
