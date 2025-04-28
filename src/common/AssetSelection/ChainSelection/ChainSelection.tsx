import type { FC } from 'react'
import { useCallback } from 'react'
import './ChainSelection.pcss'

type ChainSelectionProps = {
	logoURI?: string
	name?: string
	onClick?: () => void
}

export const ChainSelection: FC<ChainSelectionProps> = ({ logoURI, name, onClick }) => {
	const handleClick = useCallback(() => {
		if (onClick) onClick()
	}, [onClick])

	return (
		<div className="chain_selection" onClick={handleClick}>
			<img src={logoURI} alt={name || 'Chain logo'} className="chain_selection_logo" />
			<p className="chain_selection_name">{name}</p>
		</div>
	)
}
