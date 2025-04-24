import type { FC } from 'react'
import { memo } from 'react'
import { Badge } from '../../../components/layout/Badge/Badge'
import './TokenSelection.pcss'

type TokenSelectionProps = {
	logoURI?: string
	symbol?: string
	onClick?: () => void
}

export const TokenSelection: FC<TokenSelectionProps> = memo(({ logoURI, symbol, onClick }) => {
	return (
		<div className="token_selection" onClick={onClick}>
			<Badge tokenLogoSrc={logoURI || ''} size="m" />
			<p className="token_selection_name">{symbol}</p>
		</div>
	)
})
