import { VolumeChart } from '../VolumeChart/VolumeChart'
import { StatisticsCard } from '../StatisticsCard/StatisticsCard'
import { BarChart } from '../BarChart/BarChart'
import './PoolsDashboard.pcss'

export const PoolsDashboard = (): JSX.Element => {
	return (
		<div className="pools_dashboard">
			<div className="pools_analytics">
				<VolumeChart />
				<BarChart />
				<div className="pools_statistics">
					<StatisticsCard
						title="TXs"
						value={128}
						tooltip={{
							title: 'Total Transactions',
							description: 'Total number of transactions executed through Concero.',
						}}
						units="TX"
					/>
					<StatisticsCard
						title="Providers"
						value={128}
						tooltip={{
							title: 'Liquidity Providers',
							description: 'Number of users currently providing liquidity to the pools.',
						}}
						units="Users"
					/>
				</div>
			</div>
		</div>
	)
}
