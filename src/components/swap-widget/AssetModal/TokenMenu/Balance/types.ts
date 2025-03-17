import type { ILancaChain } from '@lanca/sdk'

export type BalanceProps = {
	chain: ILancaChain | null
	isLoading: boolean
	items: number
}
