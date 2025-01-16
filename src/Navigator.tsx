import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppScreen } from './components/screens/AppScreen/AppScreen'
import { Header } from './components/layout/Header/Header/Header'
import { routes } from './constants/routes'
import { FullScreenLoader } from './components/layout/FullScreenLoader/FullScreenLoader'
import { useAccount } from 'wagmi'
import { Footer } from './components/layout/Footer/Footer'
import { PoolScreen } from './components/screens/PoolScreen/PoolScreen'

import posthog from 'posthog-js'

const SwapScreen = lazy(
	async () =>
		await import('./components/screens/SwapScreen/SwapScreen').then(module => ({ default: module.SwapScreen })),
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
					<Route path={'/*'} element={<Navigate to={routes.home} />} />
				</Routes>
				<Footer />
			</AppScreen>
		</BrowserRouter>
	)
}
