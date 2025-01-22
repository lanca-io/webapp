import { memo } from 'react'
import type { PoolStateDirection } from '../../poolReducer/types'
import { SelectTokenShape } from '../../TokenArea/SelectTokenShape/SelectTokenShape'
import { Alert } from '../../../../../layout/Alert/Alert'
import { Badge } from '../../../../../layout/Badge/Badge'
import { SuccessIcon } from '../../../../../../assets/icons/SuccessIcon'
import { InfoIcon } from '../../../../../../assets/icons/InfoIcon'

import classNames from './FinishTxInfo.module.pcss'

interface Props {
	to: PoolStateDirection
	isDeposit: boolean
}

export const FinishTxInfo = memo(({ to: { amount, token, chain }, isDeposit }: Props) => {
	const title = isDeposit ? 'Deposited' : 'Withdrawal'
	const alertTitle = isDeposit ? 'Withdrawal will be available in 7 days' : 'Your funds will arrive in 7 days'
	const alertSubtitle = isDeposit ? '' : `Track its progress in 'Actions History'`
	return (
		<div className="gap-lg jc ac w-full">
			<img src="/Success.png" width={128} height={128} />

			<div className="gap-sm ac">
				<p className={classNames.title}>You {title}</p>

				<div className="row gap-sm ac">
					<h2 className={classNames.subtitle}>{Number(amount).toFixed(3)}</h2>
					<div className="row gap-xs ac">
						<Badge size="l" tokenLogoSrc={token.logoURI} chainLogoSrc={chain.logoURI} />
						<SelectTokenShape symbol={token.symbol} chainName={chain.name} />
					</div>
				</div>
			</div>
			{isDeposit ? (
				<Alert variant="neutral" title={alertTitle} subtitle={alertSubtitle} icon={<InfoIcon />} />
			) : (
				<Alert variant="success" title={alertTitle} subtitle={alertSubtitle} icon={<SuccessIcon />} />
			)}
		</div>
	)
})
