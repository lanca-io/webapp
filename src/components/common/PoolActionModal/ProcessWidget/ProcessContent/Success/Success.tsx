import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { Badge } from '@/components/common/Badge/Badge'
import { usePoolsActionContext } from '../../../Reducer/Provider'
import { PoolsActionType } from '../../../Reducer/types'
import { useInputWidgetContext } from '../../../InputWidget/Reducer/Provider'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { format } from '@/utils/format'
import './Success.pcss'

const TOKEN_CONFIG = {
	USDC: {
		name: 'USDC',
		logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
	},
	CLP: {
		name: 'CLP',
		logo: '/conceroToken.svg',
	},
} as const

export const Success: FC = memo((): JSX.Element => {
	const { state: actionState } = usePoolsActionContext()
	const { state: inputState } = useInputWidgetContext()
	const { lpPrice } = usePoolsDataStore()

	const isDeposit = actionState.type === PoolsActionType.DEPOSIT
	const token = isDeposit ? TOKEN_CONFIG.USDC : TOKEN_CONFIG.CLP

	const amount = useMemo(() => {
		if (!lpPrice) {
			return '0'
		}

		const input = parseFloat(inputState.input)
		const FEE_BPS = 0.00005

		let output
		switch (actionState.type) {
			case PoolsActionType.DEPOSIT:
				output = (input / lpPrice) * (1 - FEE_BPS)
				break
			case PoolsActionType.WITHDRAWAL:
				output = input * lpPrice * (1 - FEE_BPS)
				break
			default:
				output = 0
		}

		return output
	}, [lpPrice, actionState.type])

	const heading =
		actionState.type === PoolsActionType.DEPOSIT
			? 'You Deposited'
			: 'You will receive'
	const imageSrc = '/Swap/Success.webp'
	const altText = 'Success Process'

	return (
		<>
			<div className="pool_action_success">
				<img
					src={imageSrc}
					alt={altText}
					className="pool_action_success_image"
					data-testid="success-image"
				/>
			</div>
			<div className="pool_action_success_info">
				<div className="pool_action_success_info_heading">
					<span className="pool_action_success_info_text">{heading}</span>
				</div>
				<div className="pool_action_success_info_stats">
					<div className="pool_action_success_info_details">
						<div className="pool_action_success_info_token">
							<Badge logoURL={token?.logo} size="m" />
							<p className="pool_action_success_info_name">{token?.name}</p>
						</div>
						<p className="pool_action_success_info_pointer">on</p>
						<div className="pool_action_success_info_chain">
							<Badge
								logoURL={'https://api.v2.concero.io/static/chains/42161.svg'}
								size="m"
							/>
							<p className="pool_action_success_info_name">{'Arbitrum'}</p>
						</div>
					</div>

					<p className="pool_action_success_info_number">
						{format(Number(amount), 3)}
					</p>
				</div>
			</div>
		</>
	)
})
