import type { FC } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import { memo, useCallback } from 'react'
import { TokenSelection } from './TokenSelection/TokenSelection'
import { ChainSelection } from './ChainSelection/ChainSelection'
import { TrailArrowRightIcon } from '../../assets/icons/TrailArrowRightIcon'
import './AssetSelection.pcss'

type AssetProps = {
	token: ExtendedToken | null
	chain: ILancaChain | null
	openModal: () => void
}

export const AssetSelection: FC<AssetProps> = memo(({ token, chain, openModal }) => {
	const handleClick = useCallback(() => openModal(), [openModal])

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
