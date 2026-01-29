import type { ReactElement } from 'react'
import type { Column } from '../Table/Body/Row/Row'
import { usePoolsPositions } from '@/store/pools-positions/usePoolsPositionsStore'
import { Table } from '../Table/Table'
import { SkeletonLoader } from '../SkeletonLoader'
import './ActionsTable.pcss'

type Columns = {
	action: ReactElement
	amount: ReactElement
	fees: ReactElement
	time: ReactElement
}

const LOADING_ROWS = 10
const FEE_BASIS_POINTS = 0.05

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
		const rawAmount = action.amount ? Number(action.amount) : 0
		const displayAmount = rawAmount / 1e6
		const computedFee = (rawAmount * FEE_BASIS_POINTS) / 1e6

		return {
			action: <span className="action-type">{action.type.toUpperCase()}</span>,
			amount: <span>{displayAmount > 0 ? displayAmount.toFixed(4) : '-'}</span>,
			fees: <span>{computedFee > 0 ? computedFee.toFixed(6) : '-'}</span>,
			time: (
				<span>
					{action.created_at
						? new Date(action.created_at * 1000).toLocaleString()
						: '-'}
				</span>
			),
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
