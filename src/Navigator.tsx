import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/header/Header'
import { routes } from './constants/routes'
import { FullScreenLoader } from './components/layout/FullScreenLoader/FullScreenLoader'
import { useAccount } from 'wagmi'
import posthog from 'posthog-js'

const PoolScreen = lazy(
	async () =>
		await import('./components/screens/PoolScreen/PoolScreen').then(module => ({ default: module.PoolScreen })),
)

const USDCPoolScreen = lazy(
	async () =>
		await import('./components/screens/PoolScreen/USDCPoolScreen').then(module => ({
			default: module.USDCPoolScreen,
		})),
)

const SwapScreen = lazy(
	async () =>
		await import('./pages/Swap').then(module => ({
			default: module.SwapPage,
		})),
)

export const Navigator = () => {
	const { address } = useAccount()

	useEffect(() => {
		if (!address) return
		posthog.identify(address)
	}, [address])

	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route
					path={routes.home}
					element={
						<Suspense fallback={<FullScreenLoader />}>
							<SwapScreen />
						</Suspense>
					}
				/>
				<Route
					path={routes.pools}
					element={
						<Suspense fallback={<FullScreenLoader />}>
							<PoolScreen />
						</Suspense>
					}
				/>
				<Route
					path={routes.usdcPools}
					element={
						<Suspense fallback={<FullScreenLoader />}>
							<USDCPoolScreen />
						</Suspense>
					}
				/>
				<Route path={'/*'} element={<Navigate to={routes.home} />} />
			</Routes>
		</BrowserRouter>
	)
}
