import type { FC } from 'react'
import { memo } from 'react'
import { Heading } from './Heading/Heading'
import { Button } from '@concero/ui-kit'
import { Info } from './Info/Info'
import './PoolExtended.pcss'

type Logo = {
	src: string
	alt: string
}

type PoolExtendedProps = {
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

export const PoolExtended: FC<PoolExtendedProps> = memo(
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
		<div className="pool_extended">
			<Heading
				token={token}
				chain={chain}
				isActive={isActive}
				isFull={isFull}
				tokenLabel={tokenLabel}
				chainLabel={chainLabel}
			/>
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
			<div className="pool_extended_actions">
				<Button variant="secondary_color" size="m" isDisabled={isFull}>
					Deposit
				</Button>
				<Button variant="secondary" size="m" isDisabled={isFull}>
					Open
				</Button>
			</div>
		</div>
	),
)
