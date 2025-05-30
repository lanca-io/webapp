import { memo, type FC } from 'react'
import { Swap } from '../components/swap/Swap'

export const SwapPage: FC = memo((): JSX.Element => {
	return (
		<main>
			<Swap />
		</main>
	)
})
