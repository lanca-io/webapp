import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { Badge } from '../../../layout/Badge/Badge'
import { formatTokenAmount } from '../../../../utils/new/tokens'
import { config } from '../../../../constants/config'
import { format } from '../../../../utils/new/format'
import './RouteDirection.pcss'

type RouteDirectionProps = {
	data: any
	heading: string
}

export const RouteDirection: FC<RouteDirectionProps> = memo(({ data, heading }) => {
	const displayAmount = useMemo(() => {
		try {
			return data.token.decimals && data.amount ? formatTokenAmount(data.amount, data.token.decimals) : '0'
		} catch {
			return '0'
		}
	}, [data.amount, data.token.decimals])

	const tokenLogo = data.token.logoURL || `${config.CONCERO_ASSETS_URI}/tokens/default.svg`
	const chainLogo = data.chain.logoURL || `${config.CONCERO_ASSETS_URI}/chains/default.svg`

	return (
		<div className="route_direction">
			<p className="route_direction_heading">{heading}:</p>
			<div className="route_direction_content">
				<div className="route_direction_token">
					<Badge size="m" tokenLogoSrc={tokenLogo} borderMedium />
					<div className="route_direction_details">
						<span className="route_direction_amount">{format(Number(displayAmount), 3)}</span>
						<span className="route_direction_symbol">{data.token.symbol}</span>
					</div>
				</div>
				<span className="route_direction_pointer">on</span>
				<div className="route_direction_chain">
					<Badge size="m" tokenLogoSrc={chainLogo} borderMedium />
					<span className="route_direction_chain">{data.chain.name}</span>
				</div>
			</div>
		</div>
	)
})
