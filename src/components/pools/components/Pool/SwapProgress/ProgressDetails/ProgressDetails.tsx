import { memo } from 'react'
import { TrailArrowRightIcon } from '../../../../../../assets/icons/TrailArrowRightIcon'
import { Badge } from '../../../../../layout/Badge/Badge'
import { type PoolStateDirection } from '../../poolReducer/types'
import classNames from './ProgressDetails.module.pcss'

interface Props {
	from: PoolStateDirection
	to: PoolStateDirection
}

export const ProgressDetails = memo(({ from, to }: Props) => {
	const { token: fromToken, chain: fromChain } = from
	const { token: toToken, chain: toChain } = to

	return (
		<div className="row ac gap-sm">
			<div className={classNames.tokenBox}>
				<Badge size="xl" tokenLogoSrc={fromToken.logoURI} chainLogoSrc={fromChain.logoURI} />
			</div>
			<TrailArrowRightIcon />
			<div className={classNames.tokenBox}>
				<Badge size="xl" tokenLogoSrc={toToken.logoURI} chainLogoSrc={toChain.logoURI} />
			</div>
		</div>
	)
})
