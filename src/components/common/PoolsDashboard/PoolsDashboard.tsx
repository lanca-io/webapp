import { VolumeChart } from '../VolumeChart/VolumeChart'
import './PoolsDashboard.pcss'

export const PoolsDashboard = (): JSX.Element => {
	return (
		<div className="pools_dashboard">
			<div className="pools_analytics">
				<VolumeChart />
			</div>
		</div>
	)
}
