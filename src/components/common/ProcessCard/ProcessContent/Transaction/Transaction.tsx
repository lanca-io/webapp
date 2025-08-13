import type { FC } from 'react'
import { useMemo, memo } from 'react'
import { useFormStore } from '../../../../../store/form/useFormStore'
import { RightIcon } from '../../../../../assets/icons/RightIcon'
import './Transaction.pcss'

export const Transaction: FC = memo(() => {
	const { fromToken, fromChain, toChain, toToken } = useFormStore()

	const sourceLogo = useMemo(() => fromToken?.logo_url || '', [fromToken])
	const destinationLogo = useMemo(() => toToken?.logo_url || '', [toToken])

	return (
		<div className="transaction_content">
			<div className="transaction_content_from">
				<div className="token_with_chain">
					<img
						src={sourceLogo}
						alt="Source Token"
						className="transaction_content_image"
						data-testid="source-token-logo"
					/>
					<img src={fromChain?.logoURI || ''} alt="Source Chain" className="transaction_chain_image" />
				</div>
			</div>
			<div className="transaction_content_arrow">
				<RightIcon />
			</div>
			<div className="transaction_content_to">
				<div className="token_with_chain">
					<img src={destinationLogo} alt="Destination Token" className="transaction_content_image" />
					<img src={toChain?.logoURI || ''} alt="Destination Chain" className="transaction_chain_image" />
				</div>
			</div>
		</div>
	)
})
