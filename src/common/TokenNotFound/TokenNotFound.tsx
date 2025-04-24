import type { FC } from 'react'
import { useMemo } from 'react'
import './TokenNotFound.pcss'

export const TokenNotFound: FC = () => {
	const content = useMemo(
		() => (
			<div className="token_not_found">
				<img src="/NotFound.png" alt="Not Found" className="token_not_found_img" />
				<p className="token_not_found_text">No results found</p>
			</div>
		),
		[],
	)

	return content
}
