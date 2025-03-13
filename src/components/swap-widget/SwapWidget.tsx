import React, { useState } from 'react'
import classNames from './SwapWidget.module.pcss'
import { AssetsModal } from './AssetModal/AssetModal'
import { useTokensStore } from '../../store/tokens/useTokensStore'

export const SwapWidget: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { srcTokens, dstTokens } = useTokensStore()

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen)
	}

	const handleClose = () => {
		setIsModalOpen(false)
	}

	console.log(srcTokens, 'Source tokens')
	console.log(dstTokens, 'Destination tokens')

	return (
		<>
			<button onClick={toggleModal} className={classNames['open-modal-button']}>
				Open Modal
			</button>
			<AssetsModal direction="from" isOpen={isModalOpen} onClose={handleClose} />
		</>
	)
}
