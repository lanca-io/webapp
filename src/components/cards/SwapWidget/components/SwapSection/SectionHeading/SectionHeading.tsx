import { type ReactElement, memo } from 'react'
import './SectionHeading.pcss'

interface SectionHeadingProps {
	text: string
}

const SectionHeading = ({ text }: SectionHeadingProps): ReactElement => {
	return <p className="section-heading">{text}</p>
}

export default memo(SectionHeading)
