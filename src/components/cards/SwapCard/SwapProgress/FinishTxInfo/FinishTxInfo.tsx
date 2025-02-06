import { TimeIcon } from '../../../../../assets/icons/TimeIcon'
import type { SwapStateDirection } from '../../swapReducer/types'
import { SelectTokenShape } from '../../TokenArea/SelectTokenShape/SelectTokenShape'
import { Badge } from '../../../../layout/Badge/Badge'
import { TokenAmounts } from '../../../../../utils/TokenAmounts'
import classNames from './FinishTxInfo.module.pcss'

interface Props {
	to: SwapStateDirection
	time: number
	receivedAmount: string | undefined
}

export const FinishTxInfo = ({ to, time, receivedAmount }: Props) => {
	const formattedAmount = receivedAmount ? new TokenAmounts(receivedAmount, to.token.decimals).format(3) : 'n/a'

	return (
		<div className="gap-sm jc ac">
			<p className={classNames.title}>You received</p>
			<div className="row gap-sm ac">
				<h1 className={classNames.title}>{formattedAmount}</h1>
				<div className="row gap-xs ac">
					<Badge size="l" tokenLogoSrc={to.token.logoURI} chainLogoSrc={to.chain.logoURI} />
					<SelectTokenShape symbol={to.token.symbol} chainName={to.chain.name} />
				</div>
			</div>

			<div className="row gap-sm ac">
				<TimeIcon />
				<p>In {time} seconds</p>
			</div>
		</div>
	)
}
