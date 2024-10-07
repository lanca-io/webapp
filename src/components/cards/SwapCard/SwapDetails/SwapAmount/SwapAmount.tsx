import { Badge } from '../../../../badges/Badge/Badge'
import { config } from '../../../../../constants/config'
import { type Direction } from '../../../../../types/StandardRoute'
import { SelectTokenShape } from '../../TokenArea/SelectTokenShape/SelectTokenShape'
import { chainIdToNameMap } from '../../../../../constants/chainIdToNameMap'
import classNames from './SwapAmount.module.pcss'

interface Props {
	direction: Direction
	directionSide: 'from' | 'to'
}

export const SwapAmount = ({ direction, directionSide }: Props) => {
	return (
		<div className="gap-sm">
			<p className={`${classNames.direction} body2`}>You {directionSide === 'from' ? 'Pay' : 'receive'}</p>
			<div className="row gap-sm jsb ac w-full">
				<h1 className={classNames.amount}>{direction.amount ?? 'n/a'}</h1>
				<div className={classNames.token}>
					<Badge
						size="l"
						tokenLogoSrc={direction.token.logo_uri}
						chainLogoSrc={`${config.CONCERO_ASSETS_URI}/icons/chains/filled/${direction.chain.id}.svg`}
					/>
					<SelectTokenShape
						symbol={direction.token.symbol}
						chainName={chainIdToNameMap[Number(direction.chain.id)]}
					/>
				</div>
			</div>
		</div>
	)
}
