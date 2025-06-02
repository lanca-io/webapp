import { Address } from 'viem'

const ADMIN_ADDRESSES: string[] = Array.from(
	new Set([
		'0x239d5b78680e9AD600Ab41E56508670BA9E78F51',
		'0xFF6b3C7f70E6989c9Ec905a2a6B6415903f267F1',
		'0xE129D765458CA35B6406FA6cB3A7eCa847696268',
		'0xddDd5f804B9D293dce8819d232e8D76381605a62',
		'0xffB54219E8E4b0e08E5fA503EDc1Cf3080F73869',
		'0x55AD9B67a054d8eE6Ffb1BAE26555431d76D3ef6',
		'0x182E46CE684C26e305BFD621fdfb3C18e98E160d',
		'0x249E9020ffEff1e1013c96114Fa6fe4C685C4Efa',
		'0xDddDDb8a8E41C194ac6542a0Ad7bA663A72741E0',
		'0x5040C7AC5D4b2E13b01e0d045f8b4eF37CA4Dea6',
		'0x4cD6778754ba04F069f8D96BCD7B37Ccae6A145d',
		'0x1fF551B110ecDE2D7BABA67A2ba2552455D7f6C4',
		'0x546060B9f58182ad21fBA50bf78E71eaF3925B32',
		'0x207Da52a19bDde899f200989c04B4f62Ad5176Ef',
	]),
).map(addr => addr.toLowerCase().trim())

export const isAdminAddress = (address?: string | Address): boolean => {
	if (!address) return false
	const normalizedAddress = address?.toLowerCase().trim() ?? ''
	return ADMIN_ADDRESSES.includes(normalizedAddress)
}
