import type { ReactElement } from 'react'
import type { Column } from '../Table/Body/Row/Row'
import { usePoolsPositions } from '@/store/pools-positions/usePoolsPositionsStore'
import { Table } from '../Table/Table'
import { SkeletonLoader } from '../SkeletonLoader'
import { Action } from './Data/Action/Action'
import { Amount } from './Data/Amount/Amount'
import { Fees } from './Data/Fees/Fees'
import { Time } from './Data/Time/Time'
import './ActionsTable.pcss'

type Columns = {
	action: ReactElement
	amount: ReactElement
	fees: ReactElement
	time: ReactElement
}

const LOADING_ROWS = 10

export const ActionsTable = (): ReactElement => {
	const { actions, initialActionsLoading, dataActionsLoading } =
		usePoolsPositions()

	const columns: Column<Columns>[] = [
		{ header: 'Action', accessor: 'action' },
		{ header: 'Amount', accessor: 'amount' },
		{ header: 'Fees', accessor: 'fees' },
		{ header: 'Time', accessor: 'time' },
	]

	const data: Columns[] = actions.map(action => {
		return {
			action: <Action type={action.type} status={action.status} />,
			amount: (
				<Amount
					type={action.type}
					amount={action.amount}
					lpAmount={action.lp_amount}
				/>
			),
			fees: (
				<Fees
					type={action.type}
					amount={action.amount}
					withdrawnLpAmount={action.withdrawn_amount}
					processedAmount={action.processed_amount}
					processedLpAmount={action.processed_lp_amount}
				/>
			),
			time: <Time completedAt={action.completed_at} />,
		}
	})

	const skeletons: Columns[] = Array.from({ length: LOADING_ROWS }).map(
		(_, i) => ({
			action: <SkeletonLoader key={`action-${i}`} width="80px" height="20px" />,
			amount: <SkeletonLoader key={`amount-${i}`} width="80px" height="20px" />,
			fees: <SkeletonLoader key={`fees-${i}`} width="70px" height="20px" />,
			time: <SkeletonLoader key={`time-${i}`} width="140px" height="20px" />,
		}),
	)

	const rows =
		initialActionsLoading || dataActionsLoading ? [...data, ...skeletons] : data

	return <Table columns={columns} data={rows} />
}
