import type { FC } from 'react'

export const LeftIcon: FC<{ color?: string }> = ({ color }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.4854 3.43433C10.7978 3.74675 10.7978 4.25328 10.4854 4.5657L7.0511 8.00001L10.4854 11.4343C10.7978 11.7467 10.7978 12.2533 10.4854 12.5657C10.173 12.8781 9.66646 12.8781 9.35404 12.5657L5.35404 8.5657C5.04162 8.25328 5.04162 7.74675 5.35404 7.43433L9.35404 3.43433C9.66646 3.12191 10.173 3.12191 10.4854 3.43433Z"
				fill={color ?? '#344054'}
			/>
		</svg>
	)
}
