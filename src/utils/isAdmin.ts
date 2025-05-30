import { Address } from 'viem'
const ADMIN_ADDRESSES: string[] = Array.from(new Set(['0x239d5b78680e9AD600Ab41E56508670BA9E78F51'])).map(addr =>
	addr.toLowerCase().trim(),
)
export const isAdminAddress = (address?: string | Address): boolean => {
	if (!address) return false
	const normalizedAddress = address?.toLowerCase().trim() ?? ''
	return ADMIN_ADDRESSES.includes(normalizedAddress)
}
