import classNames from './MainRouteInfoTags.module.pcss'
import { secondsConverter } from '../../../utils/formatting'
import { GasIcon } from '../../../assets/icons/GasIcon'
import { TimeIcon } from '../../../assets/icons/TimeIcon'
import { LayersIcon } from '../../../assets/icons/LayersIcon'

interface MainRouteInfoTagsProps {
	totalGasUsd?: string | null
	stepsLength?: number | null
	transactionTimeSeconds?: number | null
}

export function MainRouteInfoTags({ totalGasUsd, stepsLength, transactionTimeSeconds }: MainRouteInfoTagsProps) {
	return (
		<div className={classNames.container}>
			{totalGasUsd && (
				<div className={classNames.tagContainer}>
					<div className="gap-sm row">
						<GasIcon />
						<p className="body2">Gas to pay:</p>
					</div>
					<p className={`body2 ${classNames.value}`}>{totalGasUsd ? `$${totalGasUsd}` : 'n/a'}</p>
				</div>
			)}
			{transactionTimeSeconds && (
				<div className={classNames.tagContainer}>
					<div className="gap-sm row">
						<TimeIcon />
						<p className="body2">ETA:</p>
					</div>
					<p
						className={`body2 ${classNames.valueBlue}`}
					>{`${secondsConverter(Number(transactionTimeSeconds))}`}</p>
				</div>
			)}
			<div className={classNames.tagContainer}>
				<div className="gap-sm row">
					<LayersIcon />
					<p className="body2">Steps:</p>
				</div>
				<p className={`body2 ${classNames.value}`}>{stepsLength ?? 'n/a'}</p>
			</div>
		</div>
	)
}
