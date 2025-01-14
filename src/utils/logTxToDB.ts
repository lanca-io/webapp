import posthog from 'posthog-js'
import { submitTx } from '../api/concero/submitFeedback'

interface LogTxToDBParams {
	tx_id?: string
	status?: string
	provider?: string
	tx_data?: any
}

export function logTxToDB({ tx_id, status, provider, tx_data }: LogTxToDBParams = {}) {
	const session_id = posthog.get_session_id()
	const replay_id = posthog.get_distinct_id()

	// submit to api
	submitTx({ tx_id, status, session_id, replay_id, provider, tx_data })
}
