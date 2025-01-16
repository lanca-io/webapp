interface IconProps {
	color?: string
}

export const RefreshIcon = ({ color = '#097BB3' }: IconProps) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<g clipPath="url(#clip0)">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12.2962 0.378335C12.692 0.847488 12.6564 1.5701 12.2165 1.99234L9.52998 4.57143L12.2165 7.15052C12.6564 7.57275 12.692 8.29537 12.2962 8.76452C11.9003 9.23368 11.2229 9.27171 10.783 8.84947L7.21161 5.42091C6.98585 5.20417 6.85693 4.89541 6.85693 4.57143C6.85693 4.24745 6.98585 3.93869 7.21161 3.72195L10.783 0.293387C11.2229 -0.128851 11.9003 -0.0908183 12.2962 0.378335Z"
					fill={color}
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M11.7038 15.2338C12.0996 14.7647 12.7771 14.7266 13.2169 15.1489L16.7883 18.5774C17.0141 18.7942 17.143 19.1029 17.143 19.4269C17.143 19.7509 17.0141 20.0596 16.7883 20.2764L13.2169 23.7049C12.7771 24.1272 12.0996 24.0891 11.7038 23.62C11.3079 23.1508 11.3436 22.4282 11.7834 22.006L14.47 19.4269L11.7834 16.8478C11.3436 16.4256 11.3079 15.703 11.7038 15.2338Z"
					fill={color}
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M8 4.53568C8 3.92486 8.48842 3.42969 9.09091 3.42969H14.1818C19.6042 3.42969 24 7.8862 24 13.3836V13.7523C24 14.3631 23.5116 14.8583 22.9091 14.8583C22.3066 14.8583 21.8182 14.3631 21.8182 13.7523V13.3836C21.8182 9.10785 18.3993 5.64167 14.1818 5.64167H9.09091C8.48842 5.64167 8 5.1465 8 4.53568Z"
					fill={color}
				/>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M1.09091 9.14453C1.6934 9.14453 2.18182 9.6397 2.18182 10.2505V10.6192C2.18182 14.8949 5.60073 18.3611 9.81818 18.3611H14.9091C15.5116 18.3611 16 18.8563 16 19.4671C16 20.0779 15.5116 20.5731 14.9091 20.5731H9.81818C4.39575 20.5731 0 16.1166 0 10.6192V10.2505C0 9.6397 0.488417 9.14453 1.09091 9.14453Z"
					fill={color}
				/>
			</g>
			<defs>
				<clipPath id="clip0">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</svg>
	)
}
