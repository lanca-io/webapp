import type { Column } from './Body/Row/Row'
import { ReactElement, useRef, useState, useEffect } from 'react'
import { Heading } from './Heading/Heading'
import { Body } from './Body/Body'
import { usePoolsPositions } from '@/store/pools-positions/usePoolsPositionsStore'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import './Table.pcss'

type TableProps<T extends { [key: string]: any }> = {
	columns: Column<T>[]
	data: T[]
}

export const Table = <T extends { [key: string]: any }>({
	columns,
	data,
}: TableProps<T>): ReactElement => {
	const { actionsPagination, setActionsPagination } = usePoolsPositions()
	const containerRef = useRef<HTMLDivElement>(null)
	const [showShadow, setShowShadow] = useState<boolean>(false)

	useInfiniteScroll(containerRef, actionsPagination, setActionsPagination, 0)

	useEffect(() => {
		const el = containerRef.current
		if (!el) return

		const checkShadow = () => {
			setShowShadow(el.scrollLeft < el.scrollWidth - el.clientWidth)
		}

		el.addEventListener('scroll', checkShadow)
		window.addEventListener('resize', checkShadow)

		checkShadow()

		return () => {
			el.removeEventListener('scroll', checkShadow)
			window.removeEventListener('resize', checkShadow)
		}
	}, [])

	return (
		<div className="table_wrapper">
			<div className="table" ref={containerRef}>
				<table className="table_content">
					<Heading headers={columns.map(col => col.header)} />
					<Body rows={data} columns={columns} />
				</table>
			</div>
			<div className="table_shadow_bottom" />
			{showShadow && <div className="table_shadow_right" />}
		</div>
	)
}
