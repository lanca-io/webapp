import { useAccount } from 'wagmi'
import { Disconnected } from './Disconnected'
import { Connected } from './Connected'
import './Account.pcss'

export const Account = (): JSX.Element => {
	const { isConnected } = useAccount()

	return <div className="header_account">{isConnected ? <Connected /> : <Disconnected />}</div>
}
