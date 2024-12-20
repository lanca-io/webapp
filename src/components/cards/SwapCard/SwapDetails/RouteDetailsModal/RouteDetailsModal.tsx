import classNames from './RouteDetailsModal.module.pcss'
import { Modal } from '../../../../modals/Modal/Modal'
import { FeeDetailsDropdown } from '../FeeDetailsDropdown/FeeDetailsDropdown'
import { MainRouteInfoTags } from '../MainRouteInfoTags/MainRouteInfoTags'
import { SwapAmount } from '../SwapAmount/SwapAmount'
import { Separator } from '../../../../layout/Separator/Separator'
import { StepCard } from '../RouteCard/Step/Step'
import { type RouteType } from 'lanca-sdk-demo'

interface RouteDetailsModalProps {
	isOpen: boolean
	setIsOpen: (param: boolean) => void
	selectedRoute: RouteType
	amountUsd: number
}

export function RouteDetailsModal({ isOpen, setIsOpen, selectedRoute }: RouteDetailsModalProps) {
	return (
		<Modal position="top" show={isOpen} setShow={setIsOpen} title={'Review'} className={classNames.modal}>
			<div className="gap-md">
				<SwapAmount directionSide="from" direction={selectedRoute.from} />
				<SwapAmount directionSide="to" direction={selectedRoute.to} />
			</div>

			<Separator />

			{selectedRoute.steps?.map((step, index) => <StepCard key={index.toString()} step={step} />)}

			<MainRouteInfoTags route={selectedRoute} />

			<Separator />

			<FeeDetailsDropdown route={selectedRoute} />
		</Modal>
	)
}
