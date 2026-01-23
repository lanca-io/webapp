import type { FC } from 'react'
import { memo } from 'react'
import { RightIcon } from '@/assets/RightIcon'
import { usePoolsActionContext } from '../../../Reducer/Provider'
import { PoolsActionType } from '../../../Reducer/types'
import './Transaction.pcss'

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

export const Transaction: FC = memo(() => {
	const { state } = usePoolsActionContext()

	const isDeposit = state.type === PoolsActionType.DEPOSIT

	return (
		<div className="pool_action_transaction_content">
			<div className="pool_action_transaction_content_from">
				<div className="pool_action_token_with_chain">
					<img
						src={isDeposit ? TOKEN_CONFIG.USDC.logo : TOKEN_CONFIG.CLP.logo}
						alt="Source Token"
						className="pool_action_transaction_content_image"
						data-testid="source-token-logo"
					/>
					<img
						src={'https://api.v2.concero.io/static/chains/42161.svg'}
						alt="Source Chain"
						className="pool_action_transaction_chain_image"
					/>
				</div>
			</div>
			<div className="pool_action_transaction_content_arrow">
				<RightIcon />
			</div>
			<div className="pool_action_transaction_content_to">
				<div className="pool_action_token_with_chain">
					<img
						src={isDeposit ? TOKEN_CONFIG.CLP.logo : TOKEN_CONFIG.USDC.logo}
						alt="Destination Token"
						className="pool_action_transaction_content_image"
					/>
					<img
						src={'https://api.v2.concero.io/static/chains/42161.svg'}
						alt="Destination Chain"
						className="pool_action_transaction_chain_image"
					/>
				</div>
			</div>
		</div>
	)
})
