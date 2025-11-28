import type { FC } from 'react'
import { IconButton } from '@concero/ui-kit'
import './Item.pcss'

type ItemProps = {
	title: string
	icon?: JSX.Element
	expandedIcon?: JSX.Element
	indenticon?: string
	isExpanded?: boolean
	tail?: JSX.Element
	onAction: () => void
}

export const Item: FC<ItemProps> = ({
	title,
	icon,
	expandedIcon,
	indenticon,
	isExpanded = false,
	tail,
	onAction,
}): JSX.Element => {
	const parentClass: string = isExpanded ? 'dropdown_item dropdown_item_expanded' : 'dropdown_item'
	const tailElement: JSX.Element | undefined = tail ? (
		isExpanded ? (
			<IconButton variant="tetrary" size="s" isHovered={false}>
				{tail}
			</IconButton>
		) : (
			tail
		)
	) : undefined

	return (
		<div className={parentClass} onClick={onAction}>
			<div className="dropdown_item_description">
				{isExpanded && expandedIcon && <div className="dropdown_item_expanded_icon">{expandedIcon}</div>}
				{indenticon && <img src={indenticon} alt="avatar" className="dropdown_item_avatar" loading="lazy" />}
				{icon && <div className="dropdown_item_icon">{icon}</div>}
				<span className="dropdown_item_label">{title}</span>
			</div>
			{tailElement}
		</div>
	)
}
