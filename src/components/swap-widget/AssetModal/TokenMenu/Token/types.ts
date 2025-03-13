import type { ExtendedToken } from '../../../../../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'

export type TokenProps = {
	token: ExtendedToken
	chain: ILancaChain
	showBalance?: boolean
	onClick?: () => void
}

export type TokenBalancesProps = {
	balance: string
	decimals?: number
	price?: number | null
}
