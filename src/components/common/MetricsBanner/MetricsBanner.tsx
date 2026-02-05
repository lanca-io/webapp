import type { ReactElement } from 'react'
import { useState, useEffect } from 'react'
import { MetricsIcon } from '@/assets/MetricsIcon'
import { Button } from '@concero/ui-kit'
import './MetricsBanner.pcss'

const KEY = 'lanca_metrics_banner'
const TTL = 6 * 60 * 60 * 1000

export const MetricsBanner = (): ReactElement | null => {
	const [show, setShow] = useState<boolean>(false)

	useEffect(() => {
		const ts = localStorage.getItem(KEY)
		if (ts) {
			const t = parseInt(ts, 10)
			const now = Date.now()
			if (now - t < TTL) return
			localStorage.removeItem(KEY)
		}
		setShow(true)
	}, [])

	const close = () => {
		localStorage.setItem(KEY, Date.now().toString())
		setShow(false)
	}

	if (!show) return null

	return (
		<div className="metrics_banner">
			<div className="metrics_banner_content">
				<div className="metrics_banner_content_icon_container">
					<MetricsIcon color="var(--color-accent-600)" />
				</div>
				<span className="metrics_banner_content_text">
					Pool metrics coming soon{' '}
					<span className="metrics_banner_text_light">
						- still being collected.
					</span>{' '}
				</span>
			</div>
			<div className="metrics_banner_action">
				<Button variant="primary" size="m" onClick={close}>
					Close
				</Button>
			</div>
		</div>
	)
}
