import type { FC } from 'react'
import { memo } from 'react'
import './ChainSelection.pcss'

type ChainSelectionProps = {
	logoURI?: string
	name?: string
	onClick?: () => void
}

export const ChainSelection: FC<ChainSelectionProps> = memo(({ logoURI, name, onClick }) => {
	return (
		<div className="chain_selection" onClick={onClick}>
			<img src={logoURI} alt={name || 'Chain logo'} className="chain_selection_logo" />
			<p className="chain_selection_name">{name}</p>
		</div>
	)
})
