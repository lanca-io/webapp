import type { FC } from 'react'
import { useAppKit, useAppKitState } from '@reown/appkit/react'
import { useIsTablet, useIsMobile } from '@/hooks'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { TrailRight } from '@/assets/icons/TrailRight'
import { IconButton } from '@concero/ui-kit'
import { blo } from 'blo'
import './Connected.pcss'

type ConnectedProps = {
	isActive: boolean
}

export const Connected: FC<ConnectedProps> = ({
	isActive,
}): JSX.Element | null => {
	const [isHovered, setIsHovered] = useState<boolean>(false)

	const { address } = useAccount()
	const { open } = useAppKit()
	const { open: isOpen } = useAppKitState()

	const isMobile: boolean = useIsMobile()
	const isTablet: boolean = useIsTablet()

	if (!address || isActive) return null

	const isCompact: boolean = isMobile || isTablet
	const isSelected: boolean = isOpen || isHovered

	const icon: string = blo(address, 32)
	const user: string = `${address.slice(0, 4)}...${address.slice(-4)}`

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
					<IconButton variant="tetrary" size="s" isHovered={isSelected}>
						<TrailRight />
					</IconButton>
				</>
			)}
		</div>
	)
}
