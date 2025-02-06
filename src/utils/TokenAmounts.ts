import { format } from './numberFormatting'
import { formatUnits } from 'viem'

export class TokenAmounts {
	private readonly tokenDecimals: number
	private readonly tokenAmount: string

	public toParsedAmount(): string {
		return formatUnits(BigInt(this.tokenAmount), this.tokenDecimals)
	}

	constructor(amount: string, decimals: number) {
		this.tokenDecimals = decimals
		this.tokenAmount = amount
	}

	public format(decimalPlaces?: number): string {
		const parsedAmount = this.toParsedAmount()
		return decimalPlaces !== undefined ? format(Number(parsedAmount), decimalPlaces) : parsedAmount
	}

	public get amount(): string {
		return this.tokenAmount
	}

	public get decimals(): number {
		return this.tokenDecimals
	}
}
