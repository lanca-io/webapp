import type { FC } from 'react'
import type { Direction } from '../AssetModal/types'
import { memo, useCallback } from 'react'
import { TokenSelection } from './TokenSelection/TokenSelection'
import { ChainSelection } from './ChainSelection/ChainSelection'
import { useFormStore } from '../../store/form/useFormStore'
import { TrailArrowRightIcon } from '../../assets/icons/TrailArrowRightIcon'
import './AssetSelection.pcss'

type AssetSelectionProps = {
	direction: Direction
	openModal: () => void
}

export const AssetSelection: FC<AssetSelectionProps> = memo(({ direction, openModal }) => {
	const { sourceChain, destinationChain, sourceToken, destinationToken } = useFormStore()

	const token = direction === 'from' ? sourceToken : destinationToken
	const chain = direction === 'from' ? sourceChain : destinationChain

	const handleClick = useCallback(() => {
		openModal()
	}, [openModal])

	return (
		<div className="asset_selection" onClick={handleClick}>
			<TokenSelection logoURI={token?.logoURI} symbol={token?.symbol} />
			<p className="asset_selection_pointer">on</p>
			<ChainSelection logoURI={chain?.logoURI} name={chain?.name} />
			<div className="asset-selection_arrow">
				<TrailArrowRightIcon />
			</div>
		</div>
	)
})
