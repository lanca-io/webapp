import type { ExtendedToken } from '../../../store/tokens/types'
import { memo } from 'react'
import { TokenSelection } from './TokenSelection/TokenSelection'
import { ChainSelection } from './ChainSelection/ChainSelection'
import { TrailArrowRightIcon } from '../../../assets/icons/TrailArrowRightIcon'
import { ConceroChain } from '../../../store/chains/types'
import './AssetSelection.pcss'

type AssetSelectionProps = {
	token: ExtendedToken | null
	chain: ConceroChain | null
	openModal?: () => void
	disabled?: boolean
}

export const AssetSelection = memo(
	({ token, chain, openModal, disabled = false }: AssetSelectionProps): JSX.Element => {
		const isDisabled = disabled || !openModal
		const hasInteractiveElement = !isDisabled

		return (
			<div
				className={`asset_selection${isDisabled ? ' asset_selection--disabled' : ''}`}
				onClick={hasInteractiveElement ? openModal : undefined}
				role={hasInteractiveElement ? 'button' : undefined}
				tabIndex={hasInteractiveElement ? 0 : -1}
				aria-disabled={isDisabled}
			>
				<TokenSelection logoURI={token?.logo_url} symbol={token?.symbol} />

				<p className="asset_selection_pointer">on</p>

				<ChainSelection logoURI={chain?.logo} name={chain?.name} />

				{hasInteractiveElement && (
					<div className="asset_selection_arrow">
						<TrailArrowRightIcon aria-hidden="true" />
					</div>
				)}
			</div>
		)
	},
)
