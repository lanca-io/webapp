export type Direction = 'from' | 'to'

export type AssetModalProps = {
	isOpen: boolean
	onClose: () => void
	direction: Direction
}
