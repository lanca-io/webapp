import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { abbreviateNumber } from '@/utils/format'
import { Heading } from './Heading/Heading'
import { Info } from './Info/Info'
import { Button } from '@concero/ui-kit'
import { SkeletonLoader } from '../SkeletonLoader'
import { PoolActionModal } from '../PoolActionModal/PoolActionModal'
import { PoolsActionType } from '../PoolActionModal/Reducer/types'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/constants'
import { useAppKit } from '@reown/appkit/react'
import './PoolExtended.pcss'

type PoolExtendedProps = {
	isConnected: boolean
	isLoading: boolean
	cap: number | null
	tvl: number | null
	deposited: number
	earned?: number
}

export const PoolExtended: FC<PoolExtendedProps> = ({
	isConnected,
	isLoading,
	tvl,
	deposited,
	cap,
}) => {
	const { open } = useAppKit()
	const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false)

	const navigate = useNavigate()

	const isActive = isConnected && deposited > 0
	const isFull = tvl !== null && cap !== null && tvl >= cap

	const handleDepositClick = () => {
		setIsDepositOpen(true)
	}

	const handleDepositClose = () => {
		setIsDepositOpen(false)
	}

	const handleOpenClick = () => {
		navigate(routes.usdcPools)
	}

	const apyInfo = useMemo(
		() => (
			<Info
				value="-"
				label="APY"
				isLoading={isLoading}
				tooltip={{
					show: true,
					description:
						'APY (Annual Percentage Yield) shows your potential annual return from rewards.',
				}}
			/>
		),
		[isLoading],
	)

	const tvlInfo = useMemo(
		() => (
			<Info
				value={abbreviateNumber(tvl ?? 0)}
				label="TVL"
				prefix="$"
				isLoading={isLoading || tvl === null}
				isHighlighted={isFull}
				tooltip={{
					show: true,
					description:
						'Total Value Locked (TVL) is the amount of liquidity currently held in this pool by all users.',
				}}
			/>
		),
		[tvl, isLoading, isFull],
	)

	const depositedInfo = useMemo(
		() => (
			<Info
				value={abbreviateNumber(deposited ?? 0)}
				label="Deposited"
				prefix="$"
				isLoading={isLoading}
			/>
		),
		[deposited, isLoading],
	)

	const earnedInfo = useMemo(
		() => <Info value="-" label="Earned" isLoading={isLoading} />,
		[isLoading],
	)

	const connectedData = useMemo(
		() => (
			<>
				{depositedInfo}
				{earnedInfo}
			</>
		),
		[depositedInfo, earnedInfo],
	)

	const actions = useMemo(
		() =>
			isLoading || tvl === null || cap === null ? (
				<div className="pool_extended_actions">
					<SkeletonLoader width={90.5} height={38} />
					<SkeletonLoader width={90.5} height={38} />
				</div>
			) : (
				<div className="pool_extended_actions">
					{isConnected ? (
						<Button
							variant="secondary_color"
							size="m"
							isDisabled={isFull}
							onClick={handleDepositClick}
						>
							Deposit
						</Button>
					) : (
						<Button variant="primary" size="m" onClick={() => open()}>
							Connect
						</Button>
					)}
					<Button variant="secondary" size="m" onClick={handleOpenClick}>
						Open
					</Button>
				</div>
			),
		[isLoading, tvl, cap, isFull, isConnected],
	)

	return (
		<>
			<div className="pool_extended">
				<Heading
					isLoading={isLoading || tvl === null || cap === null}
					isActive={isActive}
					isFull={isFull}
				/>
				{apyInfo}
				{tvlInfo}
				{isConnected && connectedData}
				{actions}
			</div>

			{isDepositOpen && (
				<PoolActionModal
					type={PoolsActionType.Deposit}
					onClose={handleDepositClose}
				/>
			)}
		</>
	)
}
