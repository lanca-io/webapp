import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppScreen } from './components/screens/AppScreen/AppScreen'
import { Header } from './components/layout/Header/Header/Header'
import { routes } from './constants/routes'
import { FullScreenLoader } from './components/layout/FullScreenLoader/FullScreenLoader'
import { useAccount } from 'wagmi'
import posthog from 'posthog-js'
import { AdminRoutesGuard } from './components/common/RouteGuards/RouteGuards'

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

const V2Screen = lazy(
	async () =>
		await import('./pages/Swap').then(module => ({
			default: module.SwapPage,
		})),
)

const SwapScreen = lazy(
	async () =>
		await import('./components/screens/SwapScreen/SwapScreen').then(module => ({
			default: module.SwapScreen,
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
			<AppScreen>
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
					<Route path={routes.v2} element={<AdminRoutesGuard />}>
						<Route
							path={routes.v2}
							element={
								<Suspense fallback={<FullScreenLoader />}>
									<V2Screen />
								</Suspense>
							}
						/>
					</Route>
					<Route path={'/*'} element={<Navigate to={routes.home} />} />
				</Routes>
			</AppScreen>
		</BrowserRouter>
	)
}
