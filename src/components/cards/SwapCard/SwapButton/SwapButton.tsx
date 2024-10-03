import { type FC } from 'react'
import { Button } from '../../../buttons/Button/Button'
import { type SwapButtonProps } from './types'
import { buttonText, ButtonType } from './constants'
import { getButtonType } from './getButtonType'
import { useTranslation } from 'react-i18next'
import { useGasSufficiency } from './useGasSufficiency'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export const SwapButton: FC<SwapButtonProps> = ({ swapState, isConnected, onClick }) => {
	const { isLoading } = swapState
	const { isLoading: isFetchBalancesLoading, gasSufficiency } = useGasSufficiency(swapState)

	const { open } = useWeb3Modal()
	const { t } = useTranslation()
	const buttonType = getButtonType(
		swapState,
		isConnected,
		gasSufficiency?.isInsufficient ?? false,
		isFetchBalancesLoading,
	)

	return (
		<Button
			isFull
			size="lg"
			variant="primary"
			isLoading={isLoading}
			onClick={buttonType === ButtonType.CONNECT_WALLET_BRIGHT ? open : onClick}
		>
			{t(buttonText[buttonType])}
		</Button>
	)
}
