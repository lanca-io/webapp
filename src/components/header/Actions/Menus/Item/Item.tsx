import type { FC } from 'react'
import { IconButton } from '@concero/ui-kit'
import './Item.pcss'

export enum ItemType {
	DEFAULT = 'default',
	EXPANDED = 'expanded',
	PROFILE = 'profile',
}

type ItemProps = {
	title: string
	icon: JSX.Element
	tail?: JSX.Element
	type: ItemType
	onAction: () => void
}

export const Item: FC<ItemProps> = ({ title, icon, tail, type = ItemType.DEFAULT, onAction }) => {
	const isDefault = type === ItemType.DEFAULT
	const isExpanded = type === ItemType.EXPANDED
	const isProfile = type === ItemType.PROFILE
	const hasTail = !!tail

	const rootClassName = [
		'dropdown_item',
		isExpanded && 'dropdown_item_expanded',
		isProfile && 'dropdown_item_profile',
	]
		.filter(Boolean)
		.join(' ')

	const descriptionClassName = [
		isDefault && 'dropdown_item_description',
		isExpanded && 'dropdown_item_expanded_description',
		isProfile && 'dropdown_item_profile_description',
	]
		.filter(Boolean)
		.join(' ') as string

	const labelClassName = [
		isDefault && 'dropdown_item_label',
		isExpanded && 'dropdown_item_expanded_label',
		isProfile && 'dropdown_item_profile_label',
	]
		.filter(Boolean)
		.join(' ') as string

	const iconElement = isProfile ? (
		icon
	) : isExpanded ? (
		<div className="dropdown_item_expanded_icon">{icon}</div>
	) : (
		<div className="dropdown_item_icon">{icon}</div>
	)

	return (
		<div className={rootClassName} data-has-expanded-icon={isExpanded} onClick={onAction}>
			<div className={descriptionClassName}>
				{iconElement}
				<span className={labelClassName}>{title}</span>
			</div>
			{hasTail &&
				(isDefault ? (
					tail
				) : (
					<IconButton variant="tetrary" size="s" isHovered={false}>
						{tail}
					</IconButton>
				))}
		</div>
	)
}
