import { getPublicClient, getWalletClient } from '@wagmi/core'
import { type Address, parseAbi } from 'viem'
import { config } from '../../web3/wagmi'

export async function unwrapWNative(
	chainId: string,
	wNativeTokenAddress: Address,
	amount: bigint,
	clientAddress: Address,
) {
	const walletClient = await getWalletClient(config, { chainId: Number(chainId) })
	const publicClient = getPublicClient(config, { chainId: Number(chainId) })

	const hash = await walletClient.writeContract({
		account: clientAddress,
		abi: parseAbi(['function withdraw(uint256) external']),
		address: wNativeTokenAddress,
		functionName: 'withdraw',
		args: [amount],
		gas: 3_000_000n,
	})

	await publicClient.waitForTransactionReceipt(hash)
}
