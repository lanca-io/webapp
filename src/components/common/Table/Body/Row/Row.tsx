import type { ReactElement } from 'react'
import './Row.pcss'

export type Column<T> = {
	header: string
	accessor: keyof T
	cellRenderer?: (value: T[keyof T], row: T) => ReactElement | string
}

type RowProps<T> = {
	row: T
	columns: Column<T>[]
}

export const Row = <T extends { [key: string]: any }>({
	row,
	columns,
}: RowProps<T>): ReactElement => (
	<tr className="table_row">
		{columns.map(({ accessor, cellRenderer }) => {
			const value = row[accessor]
			return (
				<td key={String(accessor)} className="table_cell">
					{cellRenderer ? cellRenderer(value, row) : value}
				</td>
			)
		})}
	</tr>
)
