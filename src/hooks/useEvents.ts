import _mitt, { type Emitter, type EventHandlerMap, type EventType } from 'mitt'
import { type Events } from '../types/events'

const mitt = _mitt as unknown as <Events extends Record<EventType, unknown>>(
	all?: EventHandlerMap<Events>,
) => Emitter<Events>

export const widgetEvents = mitt<Events>()

export const useEvents = () => {
	return widgetEvents
}
