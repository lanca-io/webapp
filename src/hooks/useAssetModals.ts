import type { ExtendedToken } from '../store/tokens/types'
import { useCallback } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { useModalsStore } from '../store/modals/useModalsStore'
import { useChainsStore } from '../store/chains/useChainsStore'
import { ConceroChain } from '../store/chains/types'

export const useAssetModals = () => {
	const { chains } = useChainsStore()
	const {
		fromChain,
		toChain,
		closeFromAssetModal,
		closeToAssetModal,
		setFromChain,
		setToChain,
	} = useModalsStore()
	const {
		setFromChain: setFormFromChain,
		setToChain: setFormToChain,
		setFromToken,
		setToToken,
	} = useFormStore()

	const selectFromChain = useCallback(
		(chain: ConceroChain) => setFromChain(chain),
		[setFromChain],
	)
	const selectToChain = useCallback(
		(chain: ConceroChain) => setToChain(chain),
		[setToChain],
	)

	const selectFromAsset = useCallback(
		(token: ExtendedToken) => {
			const chainId = token.chain_id
			const chain =
				fromChain ||
				Object.values(chains).find(
					chain => Number(chain.id) === Number(chainId),
				)

			if (!chain) return

			setFromToken(token)
			setFormFromChain(chain)
			closeFromAssetModal()
		},
		[chains, fromChain, setFromToken, setFormFromChain, closeFromAssetModal],
	)

	const selectToAsset = useCallback(
		(token: ExtendedToken) => {
			const chainId = token.chain_id
			const chain =
				toChain ||
				Object.values(chains).find(
					chain => Number(chain.id) === Number(chainId),
				)

			if (!chain) return

			setToToken(token)
			setFormToChain(chain)
			closeToAssetModal()
		},
		[chains, toChain, setToToken, setFormToChain, closeToAssetModal],
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
