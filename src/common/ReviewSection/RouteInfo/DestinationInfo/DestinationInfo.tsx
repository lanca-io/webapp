import type { FC } from 'react'
import { useMemo } from 'react'
import { AssetSelection } from '../../../AssetSelection/AssetSelection'
import { formatTokenAmount } from '../../../../utils/new/tokens'
import { format } from '../../../../utils/new/format'
import { tokenAmountToUsd } from '../../../../utils/new/input'
import { useFormStore } from '../../../../store/form/useFormStore'
import { useRouteStore } from '../../../../store/route/useRouteStore'
import './DestinationInfo.pcss'

export const DestinationInfo: FC = () => {
	const { destinationToken, destinationChain } = useFormStore()
	const { route, isLoading } = useRouteStore()

	const tokenAmount = useMemo(() => {
		if (!route?.to?.amount || !route.to.token?.decimals) return '0'
		return formatTokenAmount(route.to.amount, route.to.token.decimals)
	}, [route?.to?.amount, route?.to?.token?.decimals])

	const usd = useMemo(() => {
		if (isLoading || !route?.to?.token?.priceUsd) return '-'
		const usd = tokenAmountToUsd(Number(tokenAmount), route.to.token.priceUsd)
		if (!usd) return '-'
		return `= $${format(Number(usd), 4)}`
	}, [tokenAmount, route?.to?.token?.priceUsd, isLoading])

	const assetSelection = useMemo(
		() => <AssetSelection token={destinationToken} chain={destinationChain} />,
		[destinationToken, destinationChain],
	)

	return (
		<div className="route_info_destination">
			{assetSelection}
			<span className="route_info_amount">{format(Number(tokenAmount), 4)}</span>
			<span className="route_info_dollar_value">{usd}</span>
		</div>
	)
}
