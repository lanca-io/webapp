import { memo, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { Button } from '@concero/ui-kit'
import { useFormStore } from '../../store/form/useFormStore'
import { useRouteStore } from '../../store/route/useRouteStore'
import './SwapAction.pcss'

export const SwapAction = memo((): JSX.Element => {
	const { open } = useAppKit()
	const { isConnected, isConnecting } = useAccount()
	const { route, isLoading: routeLoading } = useRouteStore()
	const { error } = useFormStore()

	const isLoading = isConnecting || routeLoading
	const isDisabled = isConnected && (!!error || !route)
	const buttonText = isConnected ? 'Begin Swap' : 'Connect Wallet'

	const handleClick = useCallback(() => {
		if (!isConnected) open?.()
	}, [isConnected, open])

	return (
		<div className="swap_action_wrapper" role="region" aria-label="Swap actions">
			<div className="swap_action">
				<Button
					variant="primary"
					size="l"
					isDisabled={isDisabled || isLoading}
					isFull
					onClick={handleClick}
					aria-label={isConnected ? 'Initiate swap' : 'Connect wallet'}
				>
					{buttonText}
				</Button>
			</div>
		</div>
	)
})
