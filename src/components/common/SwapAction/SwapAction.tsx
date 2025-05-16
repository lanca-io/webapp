import { memo, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { Button } from '@concero/ui-kit'
import { useFormStore } from '../../../store/form/useFormStore'
import { useRouteStore } from '../../../store/route/useRouteStore'
import { useExecuteRoute } from '../../../hooks/useExecuteRoute'
import { useSubvariantStore } from '../../../store/subvariant/useSubvariantStore'
import { SplitSubvariantType } from '../../../store/subvariant/types'
import './SwapAction.pcss'

export const SwapAction = memo((): JSX.Element => {
	const { open } = useAppKit()
	const { state } = useSubvariantStore()
	const { isConnected, isConnecting } = useAccount()
	const { route, isLoading: routeLoading } = useRouteStore()
	const { amountInputError, addressInputError } = useFormStore()
	const executeRoute = useExecuteRoute(route)

	const isLoading = isConnecting || routeLoading

	const hasErrors =
		state === SplitSubvariantType.SEND ? !!amountInputError || !!addressInputError : !!amountInputError

	const isDisabled = isConnected && (hasErrors || !route)

	const buttonText = isConnected ? 'Begin Swap' : 'Connect Wallet'

	const handleClick = useCallback(() => {
		if (!isConnected) {
			open()
		} else {
			executeRoute()
		}
	}, [executeRoute, isConnected, open])

	return (
		<div className="swap_action_wrapper">
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
