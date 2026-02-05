import { useIsMobile, useIsTablet } from '@/hooks'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { Button } from '@concero/ui-kit'

export const Disconnected = (): JSX.Element => {
	const { isConnecting, isReconnecting } = useAccount()
	const { open } = useAppKit()

	const isLoading: boolean = isConnecting || isReconnecting
	const isMobile: boolean = useIsMobile()
	const isTablet: boolean = useIsTablet()

	return (
		<Button
			variant="primary"
			size="m"
			isLoading={isLoading}
			onClick={() => open()}
		>
			{isMobile || isTablet ? 'Connect' : 'Connect Wallet'}
		</Button>
	)
}
