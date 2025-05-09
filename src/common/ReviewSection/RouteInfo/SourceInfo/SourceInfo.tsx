import type { FC } from 'react'
import { useMemo } from 'react'
import { AssetSelection } from '../../../AssetSelection/AssetSelection'
import { formatTokenAmount } from '../../../../utils/new/tokens'
import { format } from '../../../../utils/new/format'
import { tokenAmountToUsd } from '../../../../utils/new/input'
import { useFormStore } from '../../../../store/form/useFormStore'
import './SourceInfo.pcss'

export const SourceInfo: FC = () => {
	const { sourceToken, sourceChain, amount } = useFormStore()

	const tokenAmount = useMemo(() => {
		if (!amount) return '0'
		if (sourceToken?.decimals) {
			return formatTokenAmount(amount, sourceToken.decimals)
		}
		return amount
	}, [amount, sourceToken?.decimals])

	const usd = useMemo(() => {
		if (!sourceToken?.priceUsd) return '-'
		const usd = tokenAmountToUsd(Number(tokenAmount), sourceToken.priceUsd)
		if (!usd) return '-'
		return `= $${format(Number(usd), 4)}`
	}, [tokenAmount, sourceToken?.priceUsd])

	const assetSelection = useMemo(
		() => <AssetSelection token={sourceToken} chain={sourceChain} />,
		[sourceToken, sourceChain],
	)

	return (
		<div className="route_info_source">
			{assetSelection}
			<span className="route_info_amount">{format(Number(tokenAmount), 4)}</span>
			<span className="route_info_dollar_value">{usd}</span>
		</div>
	)
}
