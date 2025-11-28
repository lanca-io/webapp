import { useAppKit, useAppKitState } from '@reown/appkit/react'
import { useIsTablet, useIsMobile } from '@/hooks'
import { useState, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { TrailRight } from '@/assets/icons/TrailRight'
import { IconButton } from '@concero/ui-kit'
import { blo } from 'blo'
import './Connected.pcss'

export const Connected = (): JSX.Element | null => {
	const [isHovered, setIsHovered] = useState<boolean>(false)
	const { address } = useAccount()

	if (!address) return null

	const { open } = useAppKit()
	const { open: isOpen } = useAppKitState()

	const isMobile: boolean = useIsMobile()
	const isTablet: boolean = useIsTablet()
	const isCompact: boolean = isMobile || isTablet
	const isActive: boolean = isOpen || isHovered

	const icon: string = useMemo(() => blo(address, 32), [address])
	const user: string = useMemo(() => `${address.slice(0, 4)}...${address.slice(-4)}`, [address])

	return (
		<div
			className="account_connected"
			data-active={isActive ? 'true' : 'false'}
			onClick={() => open()}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<img src={icon} alt="avatar" className="account_avatar" loading="lazy" />
			{!isCompact && (
				<>
					<div className="account_container">
						<span className="account_address">{user}</span>
					</div>
					<IconButton variant="tetrary" size="s" isHovered={isActive}>
						<TrailRight />
					</IconButton>
				</>
			)}
		</div>
	)
}
