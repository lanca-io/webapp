import type { FC } from 'react'
import { useAccount } from 'wagmi'
import { Disconnected } from './Disconnected'
import { Connected } from './Connected'
import './Account.pcss'

type AccountProps = {
	isActive: boolean
}

export const Account: FC<AccountProps> = ({ isActive }) => {
	const { isConnected } = useAccount()

	return (
		<div className="header_account">
			{isConnected ? <Connected isActive={isActive} /> : <Disconnected />}
		</div>
	)
}
