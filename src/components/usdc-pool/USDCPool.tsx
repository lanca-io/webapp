import type { FC } from 'react'
import { PoolOverview } from '../common/PoolOverview/PoolOverview'
import './USDCPool.pcss'

export const USDCPool: FC = () => {
	return (
		<div className="usdc_pool">
			<PoolOverview />
		</div>
	)
}
