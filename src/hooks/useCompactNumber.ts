import { useCallback } from 'react'

export const useCompactNumber = (): { format: (value: number) => string } => {
	const format = useCallback((value: number): string => {
		if (value >= 1_000_000_000) {
			return (
				(value / 1_000_000_000).toLocaleString('en-US', {
					maximumFractionDigits: 1,
				}) + 'B'
			)
		}
		if (value >= 1_000_000) {
			return (
				(value / 1_000_000).toLocaleString('en-US', {
					maximumFractionDigits: 1,
				}) + 'M'
			)
		}
		if (value >= 1_000) {
			return (
				(value / 1_000).toLocaleString('en-US', {
					maximumFractionDigits: 1,
				}) + 'K'
			)
		}
		return value.toLocaleString()
	}, [])

	return { format }
}
