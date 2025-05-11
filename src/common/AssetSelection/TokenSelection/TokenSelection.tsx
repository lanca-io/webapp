import { memo, useCallback, useMemo } from 'react'
import { Badge } from '../../../components/layout/Badge/Badge'
import './TokenSelection.pcss'

interface TokenSelectionProps {
	logoURI?: string
	symbol?: string
	onClick?: () => void
}

export const TokenSelection = memo(({ logoURI, symbol, onClick }: TokenSelectionProps): JSX.Element => {
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
})
