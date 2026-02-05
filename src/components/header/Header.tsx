import { useIsMobile } from '@/hooks'
import { useMemo } from 'react'
import { Logo } from './Logo'
import { Navigation } from './Navigation'
import { Actions } from './Actions'
import './Header.pcss'

export const Header = (): JSX.Element => {
	const isMobile: boolean = useIsMobile()

	const logo: JSX.Element = useMemo(() => <Logo />, [])
	const navigation: JSX.Element = useMemo(() => <Navigation />, [])
	const actions: JSX.Element = useMemo(() => <Actions />, [])

	return (
		<header className="header">
			{logo}
			{!isMobile && navigation}
			{actions}
		</header>
	)
}
