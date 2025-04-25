import type { FC } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import { memo, useCallback } from 'react'
import { AssetsModal } from '../AssetModal/AssetModal'
import { useFormStore } from '../../store/form/useFormStore'
import { useModalsStore } from '../../store/modals/useModalsStore'
import { useChainsStore } from '../../store/chains/useChainsStore'

export const ModalManager: FC = memo(() => {
	const { chains } = useChainsStore()

	const {
		isFromAssetModalOpen,
		isToAssetModalOpen,
		fromChain,
		toChain,
		closeFromAssetModal,
		closeToAssetModal,
		setFromChain,
		setToChain,
	} = useModalsStore()

	const { setSourceChain, setDestinationChain, setSourceToken, setDestinationToken } = useFormStore()

	const handleFromChainSelect = useCallback(
		(chain: ILancaChain): void => {
			setFromChain(chain)
		},
		[setFromChain],
	)

	const handleToChainSelect = useCallback(
		(chain: ILancaChain): void => {
			setToChain(chain)
		},
		[setToChain],
	)

	const handleFromAssetSelect = useCallback(
		(token: ExtendedToken): void => {
			const chainId = token.chain_id
			const chain = fromChain || chains.find(chain => chain.id === chainId)

			if (!chain) return

			setSourceToken(token)
			setSourceChain(chain)
			closeFromAssetModal()
		},
		[chains, fromChain, setSourceToken, setSourceChain, closeFromAssetModal],
	)

	const handleToAssetSelect = useCallback(
		(token: ExtendedToken): void => {
			const chainId = token.chain_id
			const chain = toChain || chains.find(chain => chain.id === chainId)

			if (!chain) return

			setDestinationToken(token)
			setDestinationChain(chain)
			closeToAssetModal()
		},
		[chains, toChain, setDestinationToken, setDestinationChain, closeToAssetModal],
	)

	return (
		<>
			{isFromAssetModalOpen && (
				<AssetsModal
					isOpen={isFromAssetModalOpen}
					onClose={closeFromAssetModal}
					onSelect={handleFromAssetSelect}
					onChainSelect={handleFromChainSelect}
					selectedChain={fromChain}
				/>
			)}

			{isToAssetModalOpen && (
				<AssetsModal
					isOpen={isToAssetModalOpen}
					onClose={closeToAssetModal}
					onSelect={handleToAssetSelect}
					onChainSelect={handleToChainSelect}
					selectedChain={toChain}
				/>
			)}
		</>
	)
})
