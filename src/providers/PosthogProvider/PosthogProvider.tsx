import type { FC, PropsWithChildren } from 'react'
import type { PostHogConfig } from 'posthog-js'
import { config } from '../../constants/config'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export const PosthogProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const options: Partial<PostHogConfig> = {
		api_host: `${config.CONCERO_DOMAIN_URL}/posthog`,
		autocapture: false,
		disable_session_recording: true,
	}

	return (
		<PHProvider apiKey={process.env.POSTHOG_API_KEY || ''} options={options}>
			{children}
		</PHProvider>
	)
}
