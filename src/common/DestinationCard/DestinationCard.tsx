import type { FC } from 'react'
import { useMemo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../store/form/useFormStore'
import { useModalsStore } from '../../store/modals/useModalsStore'
import { DestinationPanel } from '../DestinationPanel/DestinationPanel'
import { useRouteStore } from '../../store/route/useRouteStore'
import { formatTokenAmount } from '../../utils/new/tokens'
import './DestinationCard.pcss'

export const DestinationCard: FC = () => {
	const { route, isLoading } = useRouteStore()
	const { destinationToken, destinationChain } = useFormStore()
	const { openToAssetModal } = useModalsStore()

	const amount = useMemo(() => {
		if (!route?.to?.amount) return ''

		if (destinationToken?.decimals) {
			return formatTokenAmount(route.to.amount, destinationToken.decimals)
		}

		return route.to.amount
	}, [route?.to?.amount, destinationToken?.decimals])

	const assetSelection = useMemo(
		() => <AssetSelection token={destinationToken} chain={destinationChain} openModal={openToAssetModal} />,
		[destinationToken, destinationChain, openToAssetModal],
	)

	const destinationPanel = useMemo(
		() => <DestinationPanel amount={amount || '0'} isLoading={isLoading} />,
		[route?.to?.amount, isLoading],
	)

	return (
		<div className="destination_card">
			{assetSelection}
			{destinationPanel}
		</div>
	)
}
