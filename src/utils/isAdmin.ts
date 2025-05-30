import { Address } from 'viem'

const ADMIN_ADDRESSES: string[] = Array.from(
	new Set([
		'0x239d5b78680e9AD600Ab41E56508670BA9E78F51',
		'0xFF6b3C7f70E6989c9Ec905a2a6B6415903f267F1',
		'0xE129D765458CA35B6406FA6cB3A7eCa847696268',
		'0xddDd5f804B9D293dce8819d232e8D76381605a62',
		'0xffB54219E8E4b0e08E5fA503EDc1Cf3080F73869',
	]),
).map(addr => addr.toLowerCase().trim())

export const isAdminAddress = (address?: string | Address): boolean => {
	if (!address) return false
	const normalizedAddress = address?.toLowerCase().trim() ?? ''
	return ADMIN_ADDRESSES.includes(normalizedAddress)
}
