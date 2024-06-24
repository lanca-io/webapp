import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppScreen } from './components/screens/AppScreen/AppScreen'


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

export const Navigator = () => {

	return (
		<BrowserRouter>
				<Routes>
					<Route
						path={'/signup'}
						element={null}
					/>
					<Route
						path={'/'}
						element={null}
					/>
				</Routes>
		</BrowserRouter>
	)
}
