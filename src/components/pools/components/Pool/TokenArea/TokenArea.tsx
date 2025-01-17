import { type FC, useRef } from 'react'
import { type TokenAreaProps } from './types'
import { handleAmountChange, handleAreaClick } from '../handlers/handleTokenArea'
import { useTokenAreaReducer } from './tokenAreaReducer/useTokenAreaReducer'
import { isFloatInput } from '../../../../../utils/validation'
import { useTranslation } from 'react-i18next'
import { Badge } from '../../../../layout/Badge/Badge'
import { config } from '../../../../../constants/config'
import { AmountUSD } from './AmountUSD'
import { InputError } from '../SwapInput/InputError/InputError'
import { SelectTokenShape } from './SelectTokenShape/SelectTokenShape'
import { ErrorCategory, errorTextMap, errorTypeMap } from '../../../config/errors/ErrorType'
import { TextInput } from '../../../../layout/input/TextInput'
import { PoolActionType } from '../poolReducer/types'

import classNames from './TokenArea.module.pcss'

export const TokenArea: FC<TokenAreaProps> = ({
	isLoading,
	direction,
	selection,
	poolDispatch,
	balance = null,
	stage,
	error,
}) => {
	const [state, tokenAreaDispatch] = useTokenAreaReducer()
	const inputRef = useRef<HTMLInputElement | null>(null)
	const { t } = useTranslation()

	const isTransactionError = error ? errorTypeMap[error] === ErrorCategory.input : false
	const isError = error && isTransactionError

	const onChangeText = (value: string) => {
		poolDispatch({ type: PoolActionType.SET_INPUT_ERROR, payload: null })

		if (value && !isFloatInput(value)) tokenAreaDispatch({ type: 'SET_SHAKE', payload: true })
		if (direction === 'from') handleAmountChange({ value, state, dispatch: poolDispatch, direction })
	}

	const handleMaxButtonClick = () => {
		if (!balance) return
		const { amount } = balance
		if (!Number(amount.formatted)) return

		handleAmountChange({ value: amount.formatted, state, dispatch: poolDispatch, direction: 'from' })
	}

	return (
		<div
			className={classNames.tokenContainer}
			onClick={() => {
				handleAreaClick(inputRef, stage)
			}}
		>
			<p className={`body2 ${classNames.tokenRowHeader}`}>{t(`tokenArea.${direction}`)}</p>

			<div className={classNames.tokenRow}>
				<TextInput
					onFocus={() => {
						tokenAreaDispatch({ type: 'SET_IS_FOCUSED', payload: true })
					}}
					onBlur={() => {
						tokenAreaDispatch({ type: 'SET_IS_FOCUSED', payload: false })
					}}
					wrapperClassName={classNames.input}
					ref={inputRef as any}
					variant="inline"
					placeholder={'0'}
					value={Number(selection.amount) < 0 ? '0' : selection.amount}
					onChangeText={(value: any) => {
						onChangeText(value)
					}}
					isDisabled={direction === 'to'}
					{...(null as any)}
				/>

				<div className={classNames.selectTokenButton}>
					<Badge
						size="l"
						tokenLogoSrc={selection.token.logoURI}
						chainLogoSrc={`${config.CONCERO_ASSETS_URI}/icons/chains/filled/${selection.chain.id}.svg`}
					/>
					<SelectTokenShape symbol={selection.token.symbol} chainName={selection.chain.name} />
				</div>
			</div>

			<AmountUSD
				loading={isLoading}
				state={state}
				balance={balance}
				selection={selection}
				direction={direction}
				handleMaxButtonClick={handleMaxButtonClick}
			/>

			{isError && direction === 'from' && (
				<InputError color="var(--color-danger-700)" errorText={errorTextMap[error]} />
			)}
		</div>
	)
}
