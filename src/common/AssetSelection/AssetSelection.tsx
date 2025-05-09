import type { FC } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import { useMemo } from 'react'
import { TokenSelection } from './TokenSelection/TokenSelection'
import { ChainSelection } from './ChainSelection/ChainSelection'
import { TrailArrowRightIcon } from '../../assets/icons/TrailArrowRightIcon'
import './AssetSelection.pcss'

type AssetProps = {
	token: ExtendedToken | null
	chain: ILancaChain | null
	openModal?: () => void
	disabled?: boolean
}

export const AssetSelection: FC<AssetProps> = ({ token, chain, openModal, disabled }) => {
	const isDisabled = disabled || !openModal

	const tokenSelection = useMemo(
		() => <TokenSelection logoURI={token?.logoURI} symbol={token?.symbol} />,
		[token?.logoURI, token?.symbol],
	)

	const chainSelection = useMemo(
		() => <ChainSelection logoURI={chain?.logoURI} name={chain?.name} />,
		[chain?.logoURI, chain?.name],
	)

	const icon = useMemo(() => <TrailArrowRightIcon />, [])

	return (
		<div
			className={`asset_selection${isDisabled ? ' asset_selection--disabled' : ''}`}
			onClick={isDisabled ? undefined : openModal}
			tabIndex={isDisabled ? -1 : 0}
			aria-disabled={isDisabled}
		>
			{tokenSelection}
			<p className="asset_selection_pointer">on</p>
			{chainSelection}
			{!isDisabled && <div className="asset_selection_arrow">{icon}</div>}
		</div>
	)
}
