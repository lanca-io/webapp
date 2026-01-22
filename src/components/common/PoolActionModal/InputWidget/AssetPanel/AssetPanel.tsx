import { type FC, useMemo } from 'react'
import { PoolsActionType } from '../../Reducer/types'
import { usePoolsActionContext } from '../../Reducer/Provider'
import './AssetPanel.pcss'

export enum Direction {
	From = 'FROM',
	To = 'TO',
}

type AssetPanelProps = {
	direction: Direction
}

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

export const AssetPanel: FC<AssetPanelProps> = ({ direction }) => {
	const { state } = usePoolsActionContext()
	const isDeposit = state.type === PoolsActionType.DEPOSIT
	const isFrom = direction === Direction.From

	const token = useMemo(() => {
		if (isDeposit && isFrom) return 'USDC'
		if (isDeposit && !isFrom) return 'CLP'
		if (!isDeposit && isFrom) return 'CLP'
		return 'USDC'
	}, [isDeposit, isFrom])

	const { name, logo } = TOKEN_CONFIG[token]

	return (
		<div className="pool_action_asset_panel">
			<div className="pool_action_panel_container">
				<img
					src={logo}
					alt={`${name} token`}
					className="pool_action_asset_img"
				/>
				<span className="pool_action_panel_text">{name}</span>
			</div>
			<span className="pool_action_panel_pointer">on</span>
			<div className="pool_action_panel_container">
				<img
					src="https://api.v2.concero.io/static/chains/42161.svg"
					alt="Arbitrum"
					className="pool_action_chain_img"
				/>
				<span className="pool_action_panel_text">Arbitrum</span>
			</div>
		</div>
	)
}
