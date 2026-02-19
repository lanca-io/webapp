import type { FC } from 'react'
import { Lanca } from '../../../assets/icons/Lanca'
import { PoolCard } from '../../pools/components/Pool/Pool'

import classNames from './DepreciationWidget.module.pcss'

type DepreciationWidgetProps = {
	description: string
}

export const DepreciationWidget: FC<DepreciationWidgetProps> = ({ description }) => {
	return (
		<div className={classNames.container}>
			<div className={classNames.icon}>
				<Lanca />
			</div>
			<div className={classNames.content}>
				<div className={classNames.description}>
					<span className={classNames.title}>Lanca is entering a new chapter.</span>
					<span className={classNames.subtitle}>{description}</span>
				</div>
				<div className={classNames.action}>
					<PoolCard isWithdrawOnly />
				</div>
			</div>
		</div>
	)
}
