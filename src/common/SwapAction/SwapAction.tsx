import { useCallback, useMemo, type FC } from 'react'
import { useFormStore } from '../../store/form/useFormStore'
import { useAccount } from 'wagmi'
import { useRouteStore } from '../../store/route/useRouteStore'
import { Button } from '@concero/ui-kit'
import { useAppKit } from '@reown/appkit/react'
import './SwapAction.pcss'

export const SwapAction: FC = () => {
	const { open } = useAppKit()
	const { isConnected, isConnecting } = useAccount()
	const { route, isLoading: routeLoading } = useRouteStore()
	const { error } = useFormStore()

	const isDisabled = useMemo(() => isConnected && (!!error || !route), [isConnected, error, route])

	const isLoading = useMemo(() => isConnecting || routeLoading, [isConnecting, routeLoading])

	const handleClick = useCallback(() => {
		if (!isConnected) {
			open()
		} else {
			return
		}
	}, [isConnected, open])

	return (
		<div className="swap_action_wrapper">
			<div className="swap_action">
				<Button variant="primary" size="l" isDisabled={isDisabled || isLoading} isFull onClick={handleClick}>
					{!isConnected ? 'Connect Wallet' : 'Begin Swap'}
				</Button>
			</div>
		</div>
	)
}
