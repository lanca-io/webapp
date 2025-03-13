import type { FC } from 'react'
import { Balance } from './Balance/Balance'
import { Popular } from './Popular/Popular'

export const TokenMenu: FC = () => {
	return (
		<>
			<Balance />
			<Popular />
		</>
	)
}
