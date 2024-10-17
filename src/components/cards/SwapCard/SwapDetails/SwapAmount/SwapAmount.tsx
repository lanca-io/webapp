import { Badge } from '../../../../layout/Badge/Badge'
import { config } from '../../../../../constants/config'
import { SelectTokenShape } from '../../TokenArea/SelectTokenShape/SelectTokenShape'
import { chainIdToNameMap } from '../../../../../constants/chainIdToNameMap'
import classNames from './SwapAmount.module.pcss'
import { type SwapDirectionData } from '../../../../../sdk/types/routeTypes'

interface Props {
	direction: SwapDirectionData
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
						tokenLogoSrc={direction.token.logoURI}
						chainLogoSrc={`${config.CONCERO_ASSETS_URI}/icons/chains/filled/${direction.chain?.id}.svg`}
					/>
					<SelectTokenShape
						symbol={direction.token.symbol}
						chainName={chainIdToNameMap[Number(direction.chainId)]}
					/>
				</div>
			</div>
		</div>
	)
}
