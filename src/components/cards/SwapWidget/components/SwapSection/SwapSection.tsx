import { type ReactElement } from 'react'
import SectionHeading from './SectionHeading/SectionHeading'
import './SwapSection.pcss'

interface SwapSectionProps {
	heading: string
}

const SwapSection = ({ heading }: SwapSectionProps): ReactElement => {
	return (
		<>
			<SectionHeading text={heading} />
		</>
	)
}

export default SwapSection
