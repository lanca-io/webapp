import { useMemo } from 'react'
import { Badge } from '../../../../layout/Badge/Badge'
import { config } from '../../../../../constants/config'
import { SelectTokenShape } from '../../TokenArea/SelectTokenShape/SelectTokenShape'
import { type ISwapDirectionData } from '@lanca/sdk'
import { type ActionDirection } from '../../swapReducer/types'
import { TokenAmounts } from '../../../../../utils/TokenAmounts'

import classNames from './SwapAmount.module.pcss'

interface SwapAmountProps {
	direction: ISwapDirectionData
	directionSide: ActionDirection
}

export const SwapAmount = ({ direction, directionSide }: SwapAmountProps) => {
	const chainLogoSrc = useMemo(
		() => `${config.CONCERO_ASSETS_URI}/icons/chains/filled/${direction.chain?.id}.svg`,
		[direction.chain?.id],
	)

	const formattedAmount = useMemo(() => {
		const tokenAmounts = new TokenAmounts(direction.amount, direction.token.decimals)
		return tokenAmounts.format()
	}, [direction.amount, direction.token.decimals])

	return (
		<div className="gap-sm">
			<p className={`${classNames.direction} body2`}>You {directionSide === 'from' ? 'Pay' : 'Receive'}</p>
			<div className="row gap-sm jsb ac w-full">
				<h1 className={classNames.amount}>{formattedAmount ?? 'n/a'}</h1>
				<div className={classNames.token}>
					<Badge size="l" tokenLogoSrc={direction.token.logoURL} chainLogoSrc={chainLogoSrc} />
					<SelectTokenShape symbol={direction.token.symbol} chainName={direction.chain.name} />
				</div>
			</div>
		</div>
	)
}
