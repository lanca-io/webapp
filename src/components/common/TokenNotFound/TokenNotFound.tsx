import { memo } from 'react'
import './TokenNotFound.pcss'

export const TokenNotFound = memo(
	(): JSX.Element => (
		<div className="token_not_found" role="status" aria-live="polite" aria-label="No tokens found">
			<img
				src="/NotFound.png"
				alt=""
				className="token_not_found_img"
				aria-hidden="true"
				loading="lazy"
				draggable={false}
			/>
			<p className="token_not_found_text">No results found</p>
		</div>
	),
)
