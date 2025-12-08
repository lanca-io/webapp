import type { FC } from 'react'
import { PoolsDashboard } from '../common'
import './Pools.pcss'

export const Pools: FC = () => {
	return (
		<div className="pools">
			<PoolsDashboard />
		</div>
	)
}
