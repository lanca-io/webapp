import type { FC } from 'react'
import { useMemo, memo } from 'react'
import { useFormStore } from '../../../../../store/form/useFormStore'
import { RightIcon } from '../../../../../assets/icons/RightIcon'
import './Transaction.pcss'

export const Transaction: FC = memo((): JSX.Element => {
	const { sourceToken, destinationToken } = useFormStore()

	const sourceLogo = useMemo(() => sourceToken?.logoURI || '', [sourceToken])
	const destinationLogo = useMemo(() => destinationToken?.logoURI || '', [destinationToken])

	return (
		<div className="transaction_content">
			<div className="transaction_content_from">
				<img
					src={sourceLogo}
					alt="Source Token"
					className="transaction_content_image"
					data-testid="source-chain-logo"
				/>
			</div>
			<div className="transaction_content_arrow">
				<RightIcon />
			</div>
			<div className="transaction_content_to">
				<img
					src={destinationLogo}
					alt="Destination Token"
					className="transaction_content_image"
					data-testid="destination-chain-logo"
				/>
			</div>
		</div>
	)
})
