import type { FC } from 'react'
import { VolumeChart } from '../VolumeChart/VolumeChart'
import { StatisticsCard } from '../StatisticsCard/StatisticsCard'
import { BarChart } from '../BarChart/BarChart'
import './PoolsDashboard.pcss'

// interface Logo {
// 	src: string
// 	alt: string
// }

export const PoolsDashboard: FC = (): JSX.Element => {
	// const token: Logo = {
	// 	src: 'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png',
	// 	alt: 'USDC',
	// }

	// const chain: Logo = {
	// 	src: 'https://api.v2.concero.io/static/chains/42161.svg',
	// 	alt: 'ARB',
	// }

	const txCount = 128
	const providerCount = 128

	return (
		<div className="pools_dashboard">
			<div className="pools_analytics">
				<div className="pools_charts">
					<VolumeChart />
					<BarChart />
				</div>
				<div className="pools_statistics">
					<StatisticsCard
						title="TXs"
						value={txCount}
						tooltip={{
							title: 'Total Transactions',
							description:
								'Total number of transactions executed through Concero.',
						}}
						units="TX"
					/>
					<StatisticsCard
						title="Providers"
						value={providerCount}
						tooltip={{
							title: 'Liquidity Providers',
							description:
								'Number of users currently providing liquidity to the pools.',
						}}
						units="Users"
					/>
				</div>
			</div>
		</div>
	)
}
