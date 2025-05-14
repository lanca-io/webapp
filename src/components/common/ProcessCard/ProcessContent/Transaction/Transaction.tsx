import type { FC } from 'react'
import { useMemo, memo } from 'react'
import { useFormStore } from '../../../../../store/form/useFormStore'
import { RightIcon } from '../../../../../assets/icons/RightIcon'
import './Transaction.pcss'

export const Transaction: FC = memo(() => {
	const { sourceToken, sourceChain, destinationChain, destinationToken } = useFormStore()

	const sourceLogo = useMemo(() => sourceToken?.logoURI || '', [sourceToken])
	const destinationLogo = useMemo(() => destinationToken?.logoURI || '', [destinationToken])

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
					<img src={sourceChain?.logoURI || ''} alt="Source Chain" className="transaction_chain_image" />
				</div>
			</div>
			<div className="transaction_content_arrow">
				<RightIcon />
			</div>
			<div className="transaction_content_to">
				<div className="token_with_chain">
					<img src={destinationLogo} alt="Destination Token" className="transaction_content_image" />
					<img
						src={destinationChain?.logoURI || ''}
						alt="Destination Chain"
						className="transaction_chain_image"
					/>
				</div>
			</div>
		</div>
	)
})
