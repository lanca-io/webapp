import type { ExtendedToken } from '../../../../../store/tokens/types'

export type TokenProps = {
	token: ExtendedToken
	showBalance?: boolean
	onClick?: () => void
}

export type TokenBalancesProps = {
	balance: string
	decimals?: number
	price?: number | null
}
