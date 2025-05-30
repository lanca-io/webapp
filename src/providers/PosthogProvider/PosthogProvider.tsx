import { type FC, type PropsWithChildren, useEffect } from 'react'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { type PostHogConfig, type PostHog } from 'posthog-js'
import { config } from '../../constants/config'

const initializePostHog = (posthog: PostHog, apiKey: string, options: Partial<PostHogConfig>) => {
	posthog.init(apiKey, options)
}

const setLocalStorageValues = (posthog: PostHog) => {
	const sessionId = posthog.get_session_id()
	const distinctId = posthog.get_distinct_id()

	localStorage.setItem('app-concero-session-id', sessionId)
	localStorage.setItem('app-concero-replay-id', distinctId)
}

const setPersonProperties = (posthog: PostHog) => {
	const distinctId = localStorage.getItem('app-concero-replay-id')
	if (distinctId) {
		posthog.setPersonPropertiesForFlags({ id: distinctId })
	}
}

const useInitializePostHog = (apiKey: string, options: Partial<PostHogConfig>) => {
	const posthog = usePostHog()

	useEffect(() => {
		if (process.env.NODE_ENV === 'development') return
		initializePostHog(posthog, apiKey, options)
		setLocalStorageValues(posthog)
		setPersonProperties(posthog)
	}, [apiKey, options, posthog])
}

export const PosthogProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const apiKey = process.env.POSTHOG_API_KEY || ''
	const options: Partial<PostHogConfig> = {
		api_host: `${config.CONCERO_DOMAIN_URL}/posthog`,
		autocapture: false,
	}

	if (process.env.NODE_ENV === 'development') {
		return <>{children}</>
	}

	useInitializePostHog(apiKey, options)

	return (
		<PHProvider apiKey={apiKey} options={options}>
			{children}
		</PHProvider>
	)
}
