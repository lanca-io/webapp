import { type Direction } from '../../../../../../types/StandardRoute'
import { TokenIcon } from '../../../../../layout/TokenIcon/TokenIcon'

interface RouteStepCard {
	direction: Direction
}

export function ReviewRouteStep({ direction }: RouteStepCard) {
	return (
		<div>
			<TokenIcon tokenLogoSrc={direction.token?.logo_uri!} chainLogoSrc={direction.chain.logo_uri} />
		</div>
	)
}
