import { ILancaChain } from '@lanca/sdk'
import { ExtendedToken } from '../../../../store/tokens/types'

export type SearchBarProps = {
	chain: ILancaChain | null
	tokens: ExtendedToken[]
	setSearchValue: (value: string) => void
	onSearchResults: (hasResults: boolean) => void
	onSearchActive: (isActive: boolean) => void
}
