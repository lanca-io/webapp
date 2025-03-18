import { ExtendedToken } from '../../../../../store/tokens/types'

export type PopularProps = {
	tokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}
