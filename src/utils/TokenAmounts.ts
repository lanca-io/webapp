import { format } from './numberFormatting'

export class TokenAmounts {
	private readonly tokenDecimals: number
	private readonly tokenAmount: bigint

	private toParsedAmount(): number {
		return Number(this.amount) / 10 ** this.decimals
	}

	constructor(decimals: number, amount: bigint) {
		this.tokenDecimals = decimals
		this.tokenAmount = amount
	}

	public format(decimalPlaces?: number): string {
		return decimalPlaces ? format(this.toParsedAmount(), decimalPlaces) : this.toParsedAmount().toString()
	}

	public get amount(): bigint {
		return this.tokenAmount
	}

	public get decimals(): number {
		return this.tokenDecimals
	}
}
