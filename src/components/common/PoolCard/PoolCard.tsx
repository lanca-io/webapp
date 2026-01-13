import type { FC } from 'react'
import { Heading } from './Heading/Heading'
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
		</div>
	)
}
