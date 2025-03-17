import { Direction } from '../types'

export type SearchBarProps = {
	direction: Direction
	onSearchResults: (hasResults: boolean) => void
	onSearchActive: (isActive: boolean) => void
}
