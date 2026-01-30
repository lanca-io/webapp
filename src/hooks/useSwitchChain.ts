import { useCallback } from 'react'
import { useAppKitNetwork } from '@reown/appkit/react'
import { convertToViemChain } from '@/utils/chains'
import { useChainsStore } from '@/store/chains/useChainsStore'

export const useSwitchChain = () => {
	const { chains } = useChainsStore()
	const { switchNetwork } = useAppKitNetwork()

	const switchChain = useCallback(
		async (targetChainId: number): Promise<void> => {
			const targetChain = Object.values(chains).find(
				(chain: any) => chain.id === targetChainId,
			)
			if (!targetChain) {
				throw new Error(`Chain ${targetChainId} not configured`)
			}

			const appKitNetwork = convertToViemChain(targetChain)
			await switchNetwork(appKitNetwork)
		},
		[chains, switchNetwork],
	)

	return { switchChain }
}
