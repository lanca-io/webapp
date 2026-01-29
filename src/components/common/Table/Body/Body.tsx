import type { ReactElement } from 'react'
import { Row, Column } from './Row/Row'
import './Body.pcss'

type BodyProps<T extends { [key: string]: any }> = {
	rows: T[]
	columns: Column<T>[]
}

export const Body = <T extends { [key: string]: any }>({
	rows,
	columns,
}: BodyProps<T>): ReactElement => (
	<tbody className="table_body">
		{rows.map((row, idx) => {
			const keyValue = (row as any).messageId
			const key =
				typeof keyValue === 'string' || typeof keyValue === 'number'
					? keyValue
					: idx

			return <Row key={String(key)} row={row} columns={columns} />
		})}
	</tbody>
)
