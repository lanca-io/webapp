import { memo } from 'react'
import type { PoolStateDirection } from '../../poolReducer/types'
import { SelectTokenShape } from '../../TokenArea/SelectTokenShape/SelectTokenShape'
import classNames from './FinishTxInfo.module.pcss'
import { Separator } from '../../../../../layout/Separator/Separator'
import { Alert } from '../../../../../layout/Alert/Alert'
import { Badge } from '../../../../../layout/Badge/Badge'

interface Props {
	to: PoolStateDirection
	isDeposit: boolean
}

export const FinishTxInfo = memo(({ to: { amount, token, chain }, isDeposit }: Props) => {
	const title = isDeposit ? 'Deposited' : 'Withdrawal'
	const alertTitle = isDeposit ? 'Withdrawal will take 7 days' : 'You can claim funds after 7 days gap'
	const alertSubtitle = isDeposit
		? ''
		: 'Withdrawal will take 7 days. See “Action history” to stay in touch with the transaction statement.'

	return (
		<div className="gap-lg jc ac w-full">
			<img src="/Success.png" width={128} height={128} />

			<div className="gap-sm ac">
				<p className={classNames.title}>You {title}</p>

				<div className="row gap-sm ac">
					<h2 className={classNames.title}>{Number(amount).toFixed(3)}</h2>
					<div className="row gap-xs ac">
						<Badge size="l" tokenLogoSrc={token.logoURI} chainLogoSrc={chain.logoURI} />
						<SelectTokenShape symbol={token.symbol} chainName={chain.name} />
					</div>
				</div>
			</div>

			<Separator />
			<Alert variant="neutral" title={alertTitle} subtitle={alertSubtitle} />
		</div>
	)
})
