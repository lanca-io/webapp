import { memo, useMemo } from 'react'
import { AssetSelection } from '../../../AssetSelection/AssetSelection'
import { formatTokenAmount } from '../../../../../utils/new/tokens'
import { format } from '../../../../../utils/new/format'
import { tokenAmountToUsd } from '../../../../../utils/new/input'
import { useFormStore } from '../../../../../store/form/useFormStore'
import { useRouteStore } from '../../../../../store/route/useRouteStore'
import './SourceInfo.pcss'

export const SourceInfo = memo((): JSX.Element => {
	const { isLoading } = useRouteStore()
	const { fromToken, fromChain, fromAmount } = useFormStore()

	const tokenAmount = useMemo(() => {
		if (!fromAmount) return '0'
		return fromToken?.decimals ? formatTokenAmount(fromAmount, fromToken.decimals) : fromAmount
	}, [fromAmount, fromToken?.decimals])

	const formattedUsd = useMemo(() => {
		if (isLoading) return '-'
		if (!fromToken?.price_usd) return '-'
		const usdValue = tokenAmountToUsd(Number(tokenAmount), Number(fromToken.price_usd))
		return usdValue ? `= $${format(Number(usdValue), 2)}` : '-'
	}, [isLoading, tokenAmount, fromToken?.price_usd])

	return (
		<div className="route_info_source" role="region" aria-label="Source information">
			<AssetSelection token={fromToken} chain={fromChain} aria-label="Source asset selection" />
			<span className="route_info_amount" aria-label="Token amount">
				{format(Number(tokenAmount), 2)}
			</span>
			<span className="route_info_dollar_value" aria-label="USD value">
				{formattedUsd}
			</span>
		</div>
	)
})
