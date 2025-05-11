import { memo, useMemo } from 'react'
import { AssetSelection } from '../../../AssetSelection/AssetSelection'
import { formatTokenAmount } from '../../../../utils/new/tokens'
import { format } from '../../../../utils/new/format'
import { tokenAmountToUsd } from '../../../../utils/new/input'
import { useFormStore } from '../../../../store/form/useFormStore'
import { useRouteStore } from '../../../../store/route/useRouteStore'
import './DestinationInfo.pcss'

export const DestinationInfo = memo((): JSX.Element => {
	const { destinationToken, destinationChain } = useFormStore()
	const { route, isLoading } = useRouteStore()

	const tokenAmount = useMemo(() => {
		if (!route?.to?.amount || !route.to.token?.decimals) return '0'
		return formatTokenAmount(route.to.amount, route.to.token.decimals)
	}, [route?.to?.amount, route?.to?.token?.decimals])

	const formattedUsd = useMemo(() => {
		if (isLoading || !route?.to?.token?.priceUsd) return '-'
		const usdValue = tokenAmountToUsd(Number(tokenAmount), route.to.token.priceUsd)
		return usdValue ? `= $${format(Number(usdValue), 4)}` : '-'
	}, [tokenAmount, route?.to?.token?.priceUsd, isLoading])

	return (
		<div className="route_info_destination" role="region" aria-label="Destination information">
			<AssetSelection
				token={destinationToken}
				chain={destinationChain}
				aria-label="Destination asset selection"
			/>
			<span className="route_info_amount" aria-label="Token amount">
				{format(Number(tokenAmount), 4)}
			</span>
			<span className="route_info_dollar_value" aria-label="USD value">
				{formattedUsd}
			</span>
		</div>
	)
})
