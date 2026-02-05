import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/header/Header'
import { routes } from './constants/routes'
import { ScreenLoader } from '@/components/common/ScreenLoader/ScreenLoader'
import { useAccount } from 'wagmi'
import posthog from 'posthog-js'
import { Footer } from './components/footer/Footer'

const PoolScreen = lazy(
	async () =>
		await import('./pages/Pools').then(module => ({
			default: module.PoolsPage,
		})),
)

const USDCPoolScreen = lazy(
	async () =>
		await import('./pages/USDCPool').then(module => ({
			default: module.USDCPoolPage,
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
						<Suspense fallback={<ScreenLoader />}>
							<SwapScreen />
						</Suspense>
					}
				/>
				<Route
					path={routes.pools}
					element={
						<Suspense fallback={<ScreenLoader />}>
							<PoolScreen />
						</Suspense>
					}
				/>
				<Route
					path={routes.usdcPools}
					element={
						<Suspense fallback={<ScreenLoader />}>
							<USDCPoolScreen />
						</Suspense>
					}
				/>
				<Route path={'/*'} element={<Navigate to={routes.home} />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	)
}
