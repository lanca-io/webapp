import type { ExtendedToken } from '../../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import { useCallback } from 'react'
import { useFormStore } from '../../store/form/useFormStore'
import { useModalsStore } from '../../store/modals/useModalsStore'
import { useChainsStore } from '../../store/chains/useChainsStore'

export const useAssetModals = () => {
	const { chains } = useChainsStore()
	const { fromChain, toChain, closeFromAssetModal, closeToAssetModal, setFromChain, setToChain } = useModalsStore()
	const { setSourceChain, setDestinationChain, setSourceToken, setDestinationToken } = useFormStore()

	const selectFromChain = useCallback((chain: ILancaChain) => setFromChain(chain), [setFromChain])
	const selectToChain = useCallback((chain: ILancaChain) => setToChain(chain), [setToChain])

	const selectFromAsset = useCallback(
		(token: ExtendedToken) => {
			const chainId = token.chain_id
			const chain = fromChain || chains.find(chain => chain.id === chainId)

			if (!chain) return

			setSourceToken(token)
			setSourceChain(chain)
			closeFromAssetModal()
		},
		[chains, fromChain, setSourceToken, setSourceChain, closeFromAssetModal],
	)

	const selectToAsset = useCallback(
		(token: ExtendedToken) => {
			const chainId = token.chain_id
			const chain = toChain || chains.find(chain => chain.id === chainId)

			if (!chain) return

			setDestinationToken(token)
			setDestinationChain(chain)
			closeToAssetModal()
		},
		[chains, toChain, setDestinationToken, setDestinationChain, closeToAssetModal],
	)

	return {
		fromChain,
		toChain,
		selectFromChain,
		selectToChain,
		selectFromAsset,
		selectToAsset,
	}
}
