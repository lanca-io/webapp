import classNames from './RouteDetailsModal.module.pcss'
import { type StandardRoute } from '../../../../../types/StandardRoute'
import { StepCard } from '../RouteCard/StepCard/StepCard'
import { Modal } from '../../../../modals/Modal/Modal'
import { FeeDetailsDropdown } from '../FeeDetailsDropdown/FeeDetailsDropdown'
import { MainRouteInfoTags } from '../../../../tags/MainRouteInfoTags/MainRouteInfoTags'
import { SwapAmount } from '../SwapAmount/SwapAmount'
import { Separator } from '../../../../layout/Separator/Separator'

interface RouteDetailsModalProps {
	isOpen: boolean
	setIsOpen: (param: boolean) => void
	selectedRoute: StandardRoute
}

export function RouteDetailsModal({ isOpen, setIsOpen, selectedRoute }: RouteDetailsModalProps) {
	console.log('selectedRoute', selectedRoute)
	return (
		<Modal position="top" show={isOpen} setShow={setIsOpen} title={'Review'} className={classNames.modal}>
			<div className="gap-md">
				<SwapAmount directionSide="from" direction={selectedRoute.from} />
				<SwapAmount directionSide="to" direction={selectedRoute.to} />
			</div>

			<Separator />

			{selectedRoute.steps?.map((step, index) => (
				<StepCard key={index.toString()} innerSteps={step} index={index} />
			))}

			<MainRouteInfoTags
				transactionTimeSeconds={20}
				totalGasUsd={'0.03'}
				stepsLength={selectedRoute.steps?.length}
			/>

			<Separator />

			<FeeDetailsDropdown />
		</Modal>
	)
}
