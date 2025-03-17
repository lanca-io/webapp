import type { FC } from 'react'
import { Balance } from './Balance/Balance'
import { Popular } from './Popular/Popular'
import { TokenMenuProps } from './types'

export const TokenMenu: FC<TokenMenuProps> = ({ direction }) => {
	return (
		<>
			<Balance direction={direction} />
			<Popular direction={direction} />
		</>
	)
}
