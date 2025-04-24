import type { ExtendedToken } from '../../../../store/tokens/types'
import { Mode } from '../types'

export type InfoDisplayProps = {
	token: ExtendedToken | null
	value: string
	mode: Mode
}
