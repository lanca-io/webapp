import { memo, type FC } from 'react'
import { USDCPool } from '@/components/usdc-pool/USDCPool'

export const USDCPoolPage: FC = memo((): JSX.Element => {
	return (
		<main>
			<USDCPool />
		</main>
	)
})
