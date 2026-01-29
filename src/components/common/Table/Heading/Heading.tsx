import type { ReactElement, FC } from 'react'
import './Heading.pcss'

type HeadingProps = {
	readonly headers: string[]
}

export const Heading: FC<HeadingProps> = ({ headers }): ReactElement => (
	<thead className="table_heading">
		<span className="table_heading_text">Actions History</span>
		<tr className="table_heading_container">
			{headers.map(header => (
				<th key={header} className="table_head">
					{header}
				</th>
			))}
		</tr>
	</thead>
)
