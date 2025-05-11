import { memo, useMemo } from 'react'
import { AssetSelection } from '../../../AssetSelection/AssetSelection'
import { formatTokenAmount } from '../../../../utils/new/tokens'
import { format } from '../../../../utils/new/format'
import { tokenAmountToUsd } from '../../../../utils/new/input'
import { useFormStore } from '../../../../store/form/useFormStore'
import './SourceInfo.pcss'

export const SourceInfo = memo((): JSX.Element => {
	const { sourceToken, sourceChain, amount } = useFormStore()

	const tokenAmount = useMemo(() => {
		if (!amount) return '0'
		return sourceToken?.decimals ? formatTokenAmount(amount, sourceToken.decimals) : amount
	}, [amount, sourceToken?.decimals])

	const formattedUsd = useMemo(() => {
		if (!sourceToken?.priceUsd) return '-'
		const usdValue = tokenAmountToUsd(Number(tokenAmount), sourceToken.priceUsd)
		return usdValue ? `= $${format(Number(usdValue), 4)}` : '-'
	}, [tokenAmount, sourceToken?.priceUsd])

	return (
		<div className="route_info_source" role="region" aria-label="Source information">
			<AssetSelection token={sourceToken} chain={sourceChain} aria-label="Source asset selection" />
			<span className="route_info_amount" aria-label="Token amount">
				{format(Number(tokenAmount), 4)}
			</span>
			<span className="route_info_dollar_value" aria-label="USD value">
				{formattedUsd}
			</span>
		</div>
	)
})
