import { memo, useMemo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../../store/form/useFormStore'
import { useModalsStore } from '../../../store/modals/useModalsStore'
import { DestinationPanel } from '../DestinationPanel/DestinationPanel'
import { useRouteStore } from '../../../store/route/useRouteStore'
import { formatTokenAmount } from '../../../utils/new/tokens'
import { useSubvariantStore } from '../../../store/subvariant/useSubvariantStore'
import { RouteTimer } from '../RouteTimer/RouteTimer'
import { SplitSubvariantType } from '../../../store/subvariant/types'
import { useEstimatePriceImpact } from '../../../hooks/useEstimatePriceImpact'
import './DestinationCard.pcss'

export const DestinationCard = memo(() => {
	const { route, isLoading } = useRouteStore()
	const { severity } = useEstimatePriceImpact()
	const { state } = useSubvariantStore()
	const { toToken, toChain } = useFormStore()
	const { openToAssetModal } = useModalsStore()

	const amount = useMemo(() => {
		if (!route?.to?.amount) return ''
		return toToken?.decimals ? formatTokenAmount(route.to.amount, toToken.decimals) : route.to.amount
	}, [route?.to?.amount, toToken?.decimals])

	return (
		<div className={`destination_card_wrapper ${severity ? ` severity_${severity}` : ''}`}>
			<div
				className="destination_card"
				style={{ paddingBottom: state === SplitSubvariantType.SEND && route ? '32px' : '16px' }}
			>
				<RouteTimer />
				<AssetSelection token={toToken} chain={toChain} openModal={openToAssetModal} />
				<DestinationPanel amount={amount || '0'} isLoading={isLoading} />
			</div>
		</div>
	)
})
