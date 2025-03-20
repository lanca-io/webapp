import type { FC } from 'react'
import { useRouteStore } from '../../../../store/route/useRouteStore'
import { SkeletonLoader } from '../../../layout/SkeletonLoader/SkeletonLoader'
import classNames from './AmountDisplay.module.pcss'
import { formatTokenAmount } from '../../../../utils/new/tokens'

export const AmountDisplay: FC = () => {
	const { routes, loading } = useRouteStore()
	const amount = formatTokenAmount(routes?.to?.amount, routes?.to?.token?.decimals ?? 18)

	return (
		<div className={classNames['amount-display']}>
			{loading ? (
				<SkeletonLoader height={36} width={128} />
			) : (
				<input type="text" className={classNames['input']} placeholder="0" value={amount} readOnly />
			)}
		</div>
	)
}
