import { SVGProps } from 'react'

interface TrophyIconProps extends SVGProps<SVGSVGElement> {
	width?: number | string
	height?: number | string
	color?: string
}

export const TrophyIcon = ({ width = 24, height = 24, color = '#5925DC', ...props }: TrophyIconProps): JSX.Element => (
	<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" fill="none" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M11.1992 1.60012H4.79922V9.60012C4.79922 10.4838 5.51556 11.2001 6.39922 11.2001H9.59922C10.4829 11.2001 11.1992 10.4838 11.1992 9.60012V1.60012ZM3.19922 0.00012207V9.60012C3.19922 11.3674 4.63191 12.8001 6.39922 12.8001H9.59922C11.3665 12.8001 12.7992 11.3674 12.7992 9.60012V0.00012207H3.19922Z"
			fill={color}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M12.8008 8.00012L13.6008 8.00012C14.0426 8.00012 14.4008 7.64195 14.4008 7.20012L14.4008 4.00012C14.4008 3.55829 14.0426 3.20012 13.6008 3.20012L12.8008 3.20012L12.8008 1.60012L13.6008 1.60012C14.9263 1.60012 16.0008 2.67464 16.0008 4.00012L16.0008 7.20012C16.0008 8.5256 14.9263 9.60012 13.6008 9.60012L12.8008 9.60012L12.8008 8.00012Z"
			fill={color}
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M3.19922 3.20012L2.39922 3.20012C1.95739 3.20012 1.59922 3.55829 1.59922 4.00012L1.59922 7.20012C1.59922 7.64195 1.95739 8.00012 2.39922 8.00012L3.19922 8.00012L3.19922 9.60012L2.39922 9.60012C1.07374 9.60012 -0.000781362 8.5256 -0.000781304 7.20012L-0.000781164 4.00012C-0.000781106 2.67464 1.07374 1.60012 2.39922 1.60012L3.19922 1.60012L3.19922 3.20012Z"
			fill={color}
		/>
		<rect x="7.19922" y="11.2001" width="1.6" height="4.8" rx="0.8" fill={color} />
		<rect
			x="12.8008"
			y="14.4001"
			width="1.6"
			height="9.6"
			rx="0.8"
			transform="rotate(90 12.8008 14.4001)"
			fill={color}
		/>
	</svg>
)
