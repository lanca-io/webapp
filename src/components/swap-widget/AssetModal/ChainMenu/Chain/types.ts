import type { MouseEvent } from 'react'

export type ChainProps = {
	name: string
	logoURL: string
	onClick: (event: MouseEvent) => void
	isActive: boolean
}
