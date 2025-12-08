import { useIsMobile, useIsTablet } from '@/hooks'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { Account } from './Account'
import { Rewards } from './Rewards'
import { Burger } from './Menus/Burger'
import { Dropdown } from './Menus/Dropdown'
import { useMemo } from 'react'
import './Actions.pcss'

export const Actions = (): JSX.Element => {
	const { isConnected } = useAccount()
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const isTablet: boolean = useIsTablet()
	const isMobile: boolean = useIsMobile()

	const account: JSX.Element = useMemo(() => <Account isActive={isOpen} />, [isOpen])
	const rewards: JSX.Element = useMemo(() => <Rewards />, [])
	const divider: JSX.Element = useMemo(() => <div className="header_actions_divider" />, [])
	const dropdown: JSX.Element = useMemo(
		() => <Dropdown isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />,
		[isOpen, setIsOpen],
	)

	const burger: JSX.Element = useMemo(
		() => <Burger isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />,
		[isOpen, setIsOpen],
	)

	return (
		<div className="header_actions">
			{account}
			{!isTablet && !isMobile && (
				<>
					{rewards}
					{isOpen && divider}
				</>
			)}
			{(!isOpen || (isOpen && !isConnected) || (!isOpen && isConnected)) && divider}
			{!isMobile && dropdown}
			{isMobile && burger}
		</div>
	)
}
