export function getRelativeTime(timestampSeconds: number): string {
	const nowSeconds = Math.floor(Date.now() / 1000)
	const diffSeconds = nowSeconds - timestampSeconds

	if (diffSeconds < 60) return `${diffSeconds}s ago`
	if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
	if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`
	if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`
	if (diffSeconds < 2592000) return `${Math.floor(diffSeconds / 604800)}w ago`

	return `${Math.floor(diffSeconds / 2592000)}mo ago`
}
