import { type FC, type ForwardedRef, useEffect, useRef, useState } from 'react'
import classNames from './TokenArea.module.pcss'
import { TextInput } from '../../../layout/input/TextInput'
import { type TokenAreaProps } from './types'
import { handleAmountChange, handleAreaClick } from './handlers'
import { useTokenAreaReducer } from './useTokenAreaReducer/tokenAreaReducer'
import { isFloatInput } from '../../../../utils/validation'
import { useTranslation } from 'react-i18next'
import { TokensModal } from '../../../modals/TokensModal/TokensModal'
import { type Chain } from '../../../../api/concero/types'
import { AmountUsd } from './AmountUsd'
import { config } from '../../../../constants/config'
import { SwapActionType, SwapCardStage } from '../swapReducer/types'
import { Badge } from '../../../layout/Badge/Badge'
import { TrailArrowRightIcon } from '../../../../assets/icons/TrailArrowRightIcon'
import { SelectTokenShape } from './SelectTokenShape/SelectTokenShape'
import { InputError } from '../SwapInput/InputError/InputError'
import { ErrorCategory, errorTextMap, errorTypeMap } from '../SwapButton/constants'
import { getBalance } from '../../../../utils/getBalance'
import { useAccount } from 'wagmi'

export const TokenArea: FC<TokenAreaProps> = ({
	direction,
	selection,
	swapDispatch,
	balance = null,
	stage,
	error,
	route,
}) => {
	const { address } = useAccount()
	const { t } = useTranslation()

	const [loading, setLoading] = useState<boolean>(false)
	const [state, tokenAreaDispatch] = useTokenAreaReducer()
	const inputRef = useRef<ForwardedRef<HTMLInputElement>>()

	const isTransactionError = error ? errorTypeMap[error] === ErrorCategory.input : false
	const isError = error && isTransactionError

	const onChangeText = (value: string) => {
		swapDispatch({ type: SwapActionType.SET_INPUT_ERROR, payload: null })

		if (value && !isFloatInput(value)) tokenAreaDispatch({ type: 'SET_SHAKE', payload: true })
		if (direction === 'from') handleAmountChange({ value, state, dispatch: swapDispatch, direction })
	}

	const handleMaxButtonClick = () => {
		if (!balance) return
		const { amount } = balance
		if (!Number(amount.formatted)) return

		handleAmountChange({ value: amount.formatted, state, dispatch: swapDispatch, direction: 'from' })
	}

	const handleSelectToken = (token: Token, chain: Chain) => {
		swapDispatch({ type: SwapActionType.SET_CHAIN, direction, payload: { chain } })
		swapDispatch({ type: SwapActionType.SET_TOKEN, direction, payload: { token } })
		tokenAreaDispatch({ type: 'SET_SHOW_TOKENS_MODAL', payload: false })
	}

	useEffect(() => {
		if (direction === 'to') return
		setLoading(true)

		getBalance({ dispatch: swapDispatch, from: selection, address }).finally(() => {
			setLoading(false)
		})
	}, [selection.token.address, selection.chain.id, selection.amount, address])

	return (
		<>
			<div
				className={classNames.tokenContainer}
				onClick={() => {
					handleAreaClick(inputRef, stage)
				}}
			>
				<p className={`body2 ${classNames.tokenRowHeader}`}>{t(`tokenArea.${direction}`)}</p>

				<div className={classNames.tokenRow}>
					<TextInput
						wrapperClassName={classNames.input}
						ref={inputRef}
						onFocus={() => {
							tokenAreaDispatch({ type: 'SET_IS_FOCUSED', payload: true })
						}}
						onBlur={() => {
							tokenAreaDispatch({ type: 'SET_IS_FOCUSED', payload: false })
						}}
						variant="inline"
						placeholder={'0'}
						value={Number(selection.amount) < 0 ? '0' : selection.amount}
						onChangeText={value => {
							onChangeText(value)
						}}
						isDisabled={direction === 'to'}
					/>

					<button
						className={classNames.selectTokenButton}
						disabled={stage === SwapCardStage.review}
						onClick={e => {
							e.stopPropagation()
							tokenAreaDispatch({ type: 'SET_SHOW_TOKENS_MODAL', payload: true })
						}}
					>
						<div className="row ac">
							<Badge
								size="l"
								tokenLogoSrc={selection.token.logoURI}
								chainLogoSrc={`${config.CONCERO_ASSETS_URI}/icons/chains/filled/${selection.chain.id}.svg`}
							/>
							<SelectTokenShape symbol={selection.token.symbol} chainName={selection.chain.name} />
						</div>

						<TrailArrowRightIcon />
					</button>
				</div>

				<AmountUsd
					isFocused={state.isFocused}
					userBalance={balance}
					handleMax={handleMaxButtonClick}
					selectedTokenInfo={selection}
					direction={direction}
					selectedRoute={route}
					loading={loading}
				/>

				{isError && direction === 'from' && (
					<InputError color="var(--color-danger-700)" errorText={errorTextMap[error]} />
				)}
			</div>

			<TokensModal
				isOpen={state.showTokensModal}
				direction={direction}
				onClose={() => {
					tokenAreaDispatch({ type: 'SET_SHOW_TOKENS_MODAL', payload: false })
				}}
				onSelect={handleSelectToken}
			/>
		</>
	)
}
