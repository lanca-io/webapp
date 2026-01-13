import type { FC } from 'react'
import { memo } from 'react'
import { Heading } from './Heading/Heading'
import { Loader } from './Loader/Loader'
import { Info } from '../PoolExtended/Info'
import { Button } from '@concero/ui-kit'
import './PoolCompact.pcss'

type Logo = {
	src: string
	alt: string
}

type PoolCompact = {
	token: Logo
	chain: Logo
	isFull: boolean
	isActive: boolean
	isConnected: boolean
	tokenLabel?: string
	chainLabel?: string
	tvl: number
	deposited: number
}

export const PoolCompact: FC<PoolCompact> = memo(
	({
		token,
		chain,
		isActive,
		isFull,
		isConnected,
		tokenLabel = 'USDC',
		chainLabel = 'ARB',
		tvl,
		deposited,
	}) => (
		<div className="pool_compact">
			<div className="pool_compact_content">
				<Heading
					token={token}
					chain={chain}
					isActive={isActive}
					isFull={isFull}
					tokenLabel={tokenLabel}
					chainLabel={chainLabel}
				/>
				<Loader total={150000} value={tvl} />
				<div className="pool_compact_data">
					<Info
						value="-"
						label="APY"
						isLoading={false}
						tooltip={{
							show: true,
							description:
								'APY (Annual Percentage Yield) shows your potential annual return from rewards. It starts accruing only after your deposit is executed.',
						}}
					/>
					<Info
						value={tvl}
						label="TVL"
						symbolLeft="$"
						isLoading={false}
						tooltip={{
							show: true,
							description:
								'Total Value Locked (TVL) is the amount of liquidity currently held in this pool by all users.',
						}}
					/>
					{isConnected && (
						<>
							<Info
								value={deposited ?? 0}
								label="Deposited"
								symbolLeft="$"
								isLoading={false}
							/>
							<Info value="-" label="Earned" isLoading={false} />
						</>
					)}
				</div>
			</div>
			<div className="pool_compact_actions">
				<Button size="l" variant="secondary_color">
					Deposit
				</Button>
				<Button size="l" variant="secondary">
					Open
				</Button>
			</div>
		</div>
	),
)
