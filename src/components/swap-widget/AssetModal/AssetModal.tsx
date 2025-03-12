import type { FC } from 'react'
import type { AssetModalProps } from './types'
import { Modal } from './Modal/Modal'
import { ChainMenu } from './ChainMenu/ChainMenu'

export const AssetsModal: FC<AssetModalProps> = ({ isOpen, onClose }) => {
	return (
		<Modal title="Select a token and chain" isOpen={isOpen} onClose={onClose}>
			<ChainMenu />
		</Modal>
	)
}
