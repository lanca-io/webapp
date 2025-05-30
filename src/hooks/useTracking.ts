import { type TrackEventProps } from '../types/TrackEventProps'
import posthog from 'posthog-js'

export const trackEvent = ({ category, action, label, data }: TrackEventProps) => {
	try {
		posthog.capture(action, {
			label,
			category,
			...data,
		})
	} catch (error) {
		console.error('trackEvent error', error)
	}
}
