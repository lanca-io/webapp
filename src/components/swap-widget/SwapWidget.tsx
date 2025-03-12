import React, { useState } from 'react'
import classNames from './SwapWidget.module.pcss'
import { AssetsModal } from './AssetModal/AssetModal'
import { useTokensStore } from '../../store/tokens/TokensStore'

export const SwapWidget: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const sourceTokens = useTokensStore(state => state.sourceTokens)
	const destTokens = useTokensStore(state => state.destinationTokens)

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen)
	}

	const handleClose = () => {
		setIsModalOpen(false)
	}

	console.log(sourceTokens, 'Source tokens')
	console.log(destTokens, 'Destination tokens')

	return (
		<>
			<button onClick={toggleModal} className={classNames['open-modal-button']}>
				Open Modal
			</button>
			<AssetsModal isOpen={isModalOpen} onClose={handleClose} />
		</>
	)
}
