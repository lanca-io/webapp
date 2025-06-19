import { memo, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { Button } from '@concero/ui-kit'
import { useFormStore } from '../../../store/form/useFormStore'
import { useRouteStore } from '../../../store/route/useRouteStore'
import { useExecuteRoute } from '../../../hooks/useExecuteRoute'
import { useSubvariantStore } from '../../../store/subvariant/useSubvariantStore'
import { SplitSubvariantType } from '../../../store/subvariant/types'
import { useEstimatePriceImpact } from '../../../hooks/useEstimatePriceImpact'
import { Spinner } from '@concero/ui-kit'
import './SwapAction.pcss'

export const SwapAction = memo((): JSX.Element => {
	const { open } = useAppKit()
	const { state } = useSubvariantStore()
	const { severity } = useEstimatePriceImpact()
	const { isConnected, isConnecting } = useAccount()
	const { route, isLoading: routeLoading, error } = useRouteStore()
	const { amountInputError, addressInputError } = useFormStore()
	const { executeRoute, isExecuting } = useExecuteRoute(route)

	const isLoading = isConnecting || routeLoading || isExecuting

	const hasErrors =
		state === SplitSubvariantType.SEND ? !!amountInputError || !!addressInputError : !!amountInputError

	const isDisabled = isConnected && (hasErrors || !route || !!error)

	const buttonText = isConnected ? 'Begin Swap' : 'Connect Wallet'

	const handleClick = useCallback(() => {
		if (!isConnected) {
			open()
		} else {
			executeRoute()
		}
	}, [executeRoute, isConnected, open])

	return (
		<div className={`swap_action_wrapper ${severity ? ` severity_${severity}` : ''}`}>
			<div className="swap_action">
				<Button
					variant="primary"
					size="l"
					isDisabled={isDisabled || isLoading}
					isFull
					onClick={handleClick}
					aria-label={isConnected ? 'Initiate swap' : 'Connect wallet'}
				>
					{isLoading ? <Spinner type="gray" /> : buttonText}
				</Button>
			</div>
		</div>
	)
})
