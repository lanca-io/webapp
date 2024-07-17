import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppScreen } from './components/screens/AppScreen/AppScreen'
import { Header } from './components/layout/Header/Header/Header'
import { routes } from './constants/routes'
import { FullScreenLoader } from './components/layout/FullScreenLoader/FullScreenLoader'
import { useAccount } from 'wagmi'
import posthog from 'posthog-js'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import NotAccess from './components/screens/NotAccess/NotAccess'

const SwapScreen = lazy(
	async () =>
		await import('./components/screens/SwapScreen/SwapScreen').then(module => ({ default: module.SwapScreen })),
)

export const Navigator = () => {
	const { address } = useAccount()
	const isWhitelisted = useFeatureFlagEnabled('lanca-early-access')

	const isDevelopment = process.env.DEVELOPMENT === 'true'

	useEffect(() => {
		if (!address) return
		posthog.identify(address)
	}, [address])

	const content = isWhitelisted || isDevelopment ? <SwapScreen /> : <NotAccess />

	return (
		<BrowserRouter>
			<AppScreen>
				<Header />
				<Routes>
					<Route
						path={routes.home}
						element={
							<Suspense fallback={<FullScreenLoader />}>
								{isWhitelisted === undefined && !isDevelopment ? <FullScreenLoader /> : content}
							</Suspense>
						}
					/>
					<Route path={'/*'} element={<Navigate to={routes.home} />} />
				</Routes>
			</AppScreen>
		</BrowserRouter>
	)
}
