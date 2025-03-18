import { ExtendedToken } from '../../../../../store/tokens/types'

export type SearchTokensProps = {
	tokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}
