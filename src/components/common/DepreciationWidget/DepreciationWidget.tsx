import type { FC } from 'react'
import { Lanca } from '../../../assets/icons/Lanca'
import { PoolCard } from '../../pools/components/Pool/Pool'

import classNames from './DepreciationWidget.module.pcss'
import { UserActions } from '../../pools/components/ConceroPool/UserActions/UserActions'
import { useAccount } from 'wagmi'

type DepreciationWidgetProps = {
	description: string
}

export const DepreciationWidget: FC<DepreciationWidgetProps> = ({ description }) => {
	const { isConnected } = useAccount()
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
					{isConnected && <UserActions />}
				</div>
			</div>
		</div>
	)
}
