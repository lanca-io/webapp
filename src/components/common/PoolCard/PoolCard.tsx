import type { FC } from 'react'
import { Heading } from './Heading/Heading'
import { Info } from './Info/Info'
import './PoolCard.pcss'

type Logo = {
	src: string
	alt: string
}

type PoolCardProps = {
	token: Logo
	chain: Logo
	isFull: boolean
	isActive: boolean
	tokenLabel?: string
	chainLabel?: string
}

export const PoolCard: FC<PoolCardProps> = ({
	token,
	chain,
	isActive,
	isFull,
	tokenLabel = 'USDC',
	chainLabel = 'ARB',
}): JSX.Element => {
	return (
		<div className="pool_card">
			<Heading
				token={token}
				chain={chain}
				isActive={isActive}
				isFull={isFull}
				tokenLabel={tokenLabel}
				chainLabel={chainLabel}
			/>
			<Info value={4} label="APY" symbolRight="%" isLoading={false} />
			<Info value={7890} label="Total Loans" symbolLeft="$" isLoading={false} />
			<Info
				value={12.34}
				label="Utilization Rate"
				symbolRight="%"
				isLoading={false}
			/>
			<Info value={5.67} label="APY" symbolRight="%" isLoading={false} />
		</div>
	)
}
