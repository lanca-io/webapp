import type { FC } from 'react'
import type { AssetModalProps } from './types'
import { Modal } from './Modal/Modal'
import { ChainMenu } from './ChainMenu/ChainMenu'
import { SearchBar } from './SearchBar/SearchBar'
import { TokenMenu } from './TokenMenu/TokenMenu'

export const AssetsModal: FC<AssetModalProps> = ({ isOpen, onClose }) => {
	return (
		<Modal title="Select a token and chain" isOpen={isOpen} onClose={onClose}>
			<SearchBar />
			<ChainMenu />
			<TokenMenu />
		</Modal>
	)
}
