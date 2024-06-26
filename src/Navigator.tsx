import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppScreen } from './components/screens/AppScreen/AppScreen'
import { useEffect } from 'react'

// const SwapScreen = lazy(
// 	async () =>
// 		await import('./components/screens/SwapScreen/SwapScreen').then(module => ({ default: module.SwapScreen })),
// )
// const PortfolioScreen = lazy(
// 	async () =>
// 		await import('./components/screens/PortfolioScreen/PortfolioScreen').then(module => ({
// 			default: module.PortfolioScreen,
// 		})),
// )
// const EarnScreen = lazy(
// 	async () =>
// 		await import('./components/screens/EarnScreen/EarnScreen').then(module => ({ default: module.EarnScreen })),
// )

const Redirect = () => {
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const ref = urlParams.get('referral')
		const newRefParam = ref ? `?referral=${ref}` : ''

		window.location.replace(`https://send.lanca.io/s/clxunwa70000cf8ncscr2vms7${newRefParam}`)
	}, [])

	return null
}

export const Navigator = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={'/signup'} element={<Redirect />} />
				<Route path={'/'} element={<Redirect />} />
			</Routes>
		</BrowserRouter>
	)
}
