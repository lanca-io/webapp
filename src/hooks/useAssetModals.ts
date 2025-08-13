import type { ExtendedToken } from '../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import { useCallback } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { useModalsStore } from '../store/modals/useModalsStore'
import { useChainsStore } from '../store/chains/useChainsStore'

export const useAssetModals = () => {
	const { chains } = useChainsStore()
	const { fromChain, toChain, closeFromAssetModal, closeToAssetModal, setFromChain, setToChain } = useModalsStore()
	const { setFromChain: setFormFromChain, setToChain: setFormToChain, setFromToken, setToToken } = useFormStore()

	const selectFromChain = useCallback((chain: ILancaChain) => setFromChain(chain), [setFromChain])
	const selectToChain = useCallback((chain: ILancaChain) => setToChain(chain), [setToChain])

	const selectFromAsset = useCallback(
		(token: ExtendedToken) => {
			const chainId = token.chain_id
			const chain = fromChain || chains.find(chain => Number(chain.id) === Number(chainId))

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
			const chain = toChain || chains.find(chain => Number(chain.id) === Number(chainId))

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
