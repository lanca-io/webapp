import type { ReactElement } from 'react'
import type { Column } from '../Table/Body/Row/Row'
import { useAccount } from 'wagmi'
import { usePoolsPositions } from '@/store/pools-positions/usePoolsPositionsStore'
import { Table } from '../Table/Table'
import { SkeletonLoader } from '../SkeletonLoader'
import { Action } from './Data/Action/Action'
import { Amount } from './Data/Amount/Amount'
import { Fees } from './Data/Fees/Fees'
import { Time } from './Data/Time/Time'
import { Compact } from './Data/Compact/Compact'
import { useIsMobile } from '@/hooks'
import './ActionsTable.pcss'

type Columns = {
	action: ReactElement
	amount: ReactElement
	fees: ReactElement
	time: ReactElement
}

const LOADING_ROWS = 10

export const ActionsTable = (): ReactElement | null => {
	const { isConnected } = useAccount()
	const { actions, initialActionsLoading, dataActionsLoading } =
		usePoolsPositions()
	const isMobile = useIsMobile()

	if (!isConnected) {
		return null
	}

	if (actions.length === 0 && !initialActionsLoading && !dataActionsLoading) {
		return null
	}

	const columns: Column<Columns>[] = [
		{ header: 'Action', accessor: 'action' },
		{ header: 'Amount', accessor: 'amount' },
		{ header: 'Fees', accessor: 'fees' },
		{ header: 'Time', accessor: 'time' },
	]

	const data: Columns[] = actions.map(action => ({
		action: isMobile ? (
			<Compact
				type={action.type}
				status={action.status}
				completedAt={action.completed_at}
				amount={action.amount}
				lpAmount={action.lp_amount}
				withdrawnLpAmount={action.withdrawn_amount}
				processedAmount={action.processed_amount}
				processedLpAmount={action.processed_lp_amount}
			/>
		) : (
			<Action type={action.type} status={action.status} />
		),
		amount: isMobile ? (
			<></>
		) : (
			<Amount
				type={action.type}
				amount={action.amount}
				lpAmount={action.lp_amount}
			/>
		),
		fees: isMobile ? (
			<></>
		) : (
			<Fees
				type={action.type}
				amount={action.amount}
				withdrawnLpAmount={action.withdrawn_amount}
				processedAmount={action.processed_amount}
				processedLpAmount={action.processed_lp_amount}
			/>
		),
		time: isMobile ? <></> : <Time completedAt={action.completed_at} />,
	}))

	const skeletons: Columns[] = Array.from({ length: LOADING_ROWS }).map(() =>
		isMobile
			? {
					action: <SkeletonLoader width="100%" height="70px" />,
					amount: <></>,
					fees: <></>,
					time: <></>,
				}
			: {
					action: <SkeletonLoader width="80px" height="20px" />,
					amount: <SkeletonLoader width="80px" height="20px" />,
					fees: <SkeletonLoader width="70px" height="20px" />,
					time: <SkeletonLoader width="140px" height="20px" />,
				},
	)

	const rows =
		initialActionsLoading || dataActionsLoading ? [...data, ...skeletons] : data

	return <Table columns={columns} data={rows} />
}
