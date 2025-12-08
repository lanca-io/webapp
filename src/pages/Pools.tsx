import { memo, type FC } from 'react'
import { Pools } from '@/components/pools/Pools'

export const PoolsPage: FC = memo((): JSX.Element => {
	return (
		<main>
			<Pools />
		</main>
	)
})
