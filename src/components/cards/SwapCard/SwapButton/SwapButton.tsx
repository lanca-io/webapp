import { Button } from '../../../layout/buttons/Button/Button'
import { type SwapButtonProps } from './types'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'

export const SwapButton = ({ error, onClick, isLoading }: SwapButtonProps) => {
	const { isConnected } = useAccount()
	const { open } = useAppKit()

	return (
		<Button
			isDisabled={!!error}
			isFull
			size="lg"
			variant="primary"
			isLoading={isLoading}
			onClick={
				isConnected
					? onClick
					: async () => {
							await open()
						}
			}
		>
			{isConnected ? 'Begin Swap' : 'Connect Wallet'}
		</Button>
	)
}
