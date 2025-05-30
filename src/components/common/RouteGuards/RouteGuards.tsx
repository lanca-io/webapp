import { FC, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { Navigate, Outlet } from 'react-router-dom'
import { routes } from '../../../constants/routes'
import { isAdminAddress } from '../../../utils/isAdmin'
import { FullScreenLoader } from '../../layout/FullScreenLoader/FullScreenLoader'

export const AdminRoutesGuard: FC = (): JSX.Element => {
	const { isConnected, isConnecting, address } = useAccount()
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isAdmin, setIsAdmin] = useState<boolean>(false)

	useEffect(() => {
		if (!isConnecting) {
			const adminCheck = isConnected && address ? isAdminAddress(address) : false
			setIsAdmin(adminCheck)
			setIsLoading(false)
		}
	}, [isConnecting, isConnected, address])

	if (isLoading) {
		return <FullScreenLoader />
	}

	return isConnected && isAdmin ? <Outlet /> : <Navigate to={routes.home} replace />
}
