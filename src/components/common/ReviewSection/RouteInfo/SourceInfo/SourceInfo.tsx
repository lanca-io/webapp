import { memo, useMemo } from 'react'
import { AssetSelection } from '../../../AssetSelection/AssetSelection'
import { formatTokenAmount } from '../../../../../utils/new/tokens'
import { format } from '../../../../../utils/new/format'
import { tokenAmountToUsd } from '../../../../../utils/new/input'
import { useFormStore } from '../../../../../store/form/useFormStore'
import './SourceInfo.pcss'

export const SourceInfo = memo((): JSX.Element => {
	const { fromToken, fromChain, fromAmount } = useFormStore()

	const tokenAmount = useMemo(() => {
		if (!fromAmount) return '0'
		return fromToken?.decimals ? formatTokenAmount(fromAmount, fromToken.decimals) : fromAmount
	}, [fromAmount, fromToken?.decimals])

	const formattedUsd = useMemo(() => {
		if (!fromToken?.priceUsd) return '-'
		const usdValue = tokenAmountToUsd(Number(tokenAmount), fromToken.priceUsd)
		return usdValue ? `= $${format(Number(usdValue), 4)}` : '-'
	}, [tokenAmount, fromToken?.priceUsd])

	return (
		<div className="route_info_source" role="region" aria-label="Source information">
			<AssetSelection token={fromToken} chain={fromChain} aria-label="Source asset selection" />
			<span className="route_info_amount" aria-label="Token amount">
				{format(Number(tokenAmount), 4)}
			</span>
			<span className="route_info_dollar_value" aria-label="USD value">
				{formattedUsd}
			</span>
		</div>
	)
})
