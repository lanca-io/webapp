import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { Badge } from '../../../components/layout/Badge/Badge'
import './TokenSelection.pcss'

type TokenSelectionProps = {
	logoURI?: string
	symbol?: string
	onClick?: () => void
}

export const TokenSelection: FC<TokenSelectionProps> = ({ logoURI, symbol, onClick }) => {
	const handleClick = useCallback(() => {
		if (onClick) onClick()
	}, [onClick])

	const badge = useMemo(() => <Badge tokenLogoSrc={logoURI || ''} size="m" />, [logoURI])

	return (
		<div className="token_selection" onClick={handleClick}>
			{badge}
			<p className="token_selection_name">{symbol}</p>
		</div>
	)
}
