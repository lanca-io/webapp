import type { FC } from 'react'

interface MetricsIconProps {
	color?: string
}

export const MetricsIcon: FC<MetricsIconProps> = ({ color = '#097BB3' }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0 22.8001C0 22.1374 0.537258 21.6001 1.2 21.6001H22.8C23.4627 21.6001 24 22.1374 24 22.8001C24 23.4628 23.4627 24.0001 22.8 24.0001H1.2C0.537258 24.0001 0 23.4628 0 22.8001Z"
			fill={color}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M0 9.5999C0 8.93716 0.537258 8.3999 1.2 8.3999H5.2C5.86274 8.3999 6.4 8.93716 6.4 9.5999V19.1999C6.4 19.8626 5.86274 20.3999 5.2 20.3999H1.2C0.537258 20.3999 0 19.8626 0 19.1999V9.5999ZM2.4 10.7999V17.9999H4V10.7999H2.4Z"
			fill={color}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M17.5996 1.2C17.5996 0.537258 18.1369 0 18.7996 0H22.7996C23.4624 0 23.9996 0.537258 23.9996 1.2V19.2C23.9996 19.8627 23.4624 20.4 22.7996 20.4H18.7996C18.1369 20.4 17.5996 19.8627 17.5996 19.2V1.2ZM19.9996 2.4V18H21.5996V2.4H19.9996Z"
			fill={color}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M9 6.00005C9 5.33731 9.53726 4.80005 10.2 4.80005H14.3C14.9627 4.80005 15.5 5.33731 15.5 6.00005V19.2C15.5 19.8628 14.9627 20.4 14.3 20.4H10.2C9.53726 20.4 9 19.8628 9 19.2V6.00005ZM11.4 7.20005V18H13.1V7.20005H11.4Z"
			fill={color}
		/>
	</svg>
)
