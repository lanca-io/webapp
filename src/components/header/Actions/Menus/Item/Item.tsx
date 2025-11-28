import type { FC } from 'react'
import './Item.pcss'

type ItemProps = {
	title: string
	icon?: JSX.Element
	indenticon?: string
	tail?: JSX.Element
	onAction: () => void
}

export const Item: FC<ItemProps> = ({ title, icon, indenticon, tail, onAction }): JSX.Element => {
	return (
		<div className="dropdown_item " onClick={onAction}>
			<div className="dropdown_item_description">
				{indenticon && <img src={indenticon} alt="avatar" className="dropdown_item_avatar" loading="lazy" />}
				{icon && <div className="dropdown_item_icon">{icon}</div>}
				<span className="dropdown_item_label">{title}</span>
			</div>
			{tail}
		</div>
	)
}
