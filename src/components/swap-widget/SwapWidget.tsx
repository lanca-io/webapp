import React, { useState } from 'react'
import { AssetsModal } from './AssetModal/AssetModal'
import classNames from './SwapWidget.module.pcss'
import { useTokensStore } from '../../store/tokens/useTokensStore'

export const SwapWidget: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { allTokens } = useTokensStore()

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen)
	}

	const handleClose = () => {
		setIsModalOpen(false)
	}

	console.log(allTokens)

	return (
		<>
			<button onClick={toggleModal} className={classNames['open-modal-button']}>
				Open Modal
			</button>
			<AssetsModal direction="from" isOpen={isModalOpen} onClose={handleClose} />
		</>
	)
}
