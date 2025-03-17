import type { FC } from 'react'

import classNames from './TokenNotFound.module.pcss'

export const TokenNotFound: FC = () => {
	return (
		<div className={classNames['token-not-found']}>
			<img src="/NotFound.png" alt="Not Found" className={classNames['token-not-found__img']} />
			<p className={classNames['token-not-found__text']}>No results found</p>
		</div>
	)
}
