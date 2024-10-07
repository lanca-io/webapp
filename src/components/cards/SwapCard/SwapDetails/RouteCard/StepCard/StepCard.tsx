import { type Step } from '../../../../../../types/StandardRoute'
import classNames from './StepCard.module.pcss'
import { InnerStepCard } from './InnerStepCard/InnerStepCard'

interface StepCardProps {
	innerSteps: Step[] | null
}

export function StepCard({ innerSteps }: StepCardProps) {
	return (
		<div className={classNames.container}>
			{innerSteps?.map((innerStep: Step, i: number) => {
				return <InnerStepCard key={i.toString()} step={innerStep} />
			})}
		</div>
	)
}
