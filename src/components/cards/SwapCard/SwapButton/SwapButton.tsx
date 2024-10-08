import { type FC } from 'react'
import { Button } from '../../../layout/buttons/Button/Button'
import { type SwapButtonProps } from './types'
import { ButtonType } from './constants'
import { getButtonType } from './getButtonType'
import { useGasSufficiency } from './useGasSufficiency'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export const SwapButton: FC<SwapButtonProps> = ({ swapState, isConnected, onClick }) => {
	const { isLoading } = swapState
	const { isLoading: isFetchBalancesLoading, gasSufficiency } = useGasSufficiency(swapState)

	const { open } = useWeb3Modal()
	const buttonType = getButtonType(
		swapState,
		isConnected,
		gasSufficiency?.isInsufficient ?? false,
		isFetchBalancesLoading,
	)
	const walletIsConnect = buttonType === ButtonType.CONNECT_WALLET_BRIGHT

	return (
		<Button isFull size="lg" variant="primary" isLoading={isLoading} onClick={walletIsConnect ? open : onClick}>
			{/* {t(buttonText[buttonType])} */}
			{walletIsConnect ? 'Connect Wallet' : 'Begin Swap'}
		</Button>
	)
}
