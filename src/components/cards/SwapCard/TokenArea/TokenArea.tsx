import { type FC, type ForwardedRef, useRef } from 'react'
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
import { SwapCardStage } from '../swapReducer/types'
import { Badge } from '../../../layout/Badge/Badge'
import { TrailArrowRightIcon } from '../../../../assets/icons/TrailArrowRightIcon'
import { SelectTokenShape } from './SelectTokenShape/SelectTokenShape'
import { InputError } from '../SwapInput/InputError/InputError'

export const TokenArea: FC<TokenAreaProps> = ({ direction, selection, swapDispatch, balance = null, stage }) => {
	const [state, tokenAreaDispatch] = useTokenAreaReducer()
	const inputRef = useRef<ForwardedRef<HTMLInputElement>>()
	const { t } = useTranslation()

	const onChangeText = (value: string) => {
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
		swapDispatch({ type: 'SET_CHAIN', direction, payload: { chain } })
		swapDispatch({ type: 'SET_TOKEN', direction, payload: { token } })
		tokenAreaDispatch({ type: 'SET_SHOW_TOKENS_MODAL', payload: false })
	}

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
					state={state}
					balance={balance}
					selection={selection}
					direction={direction}
					handleMaxButtonClick={handleMaxButtonClick}
				/>

				{direction === 'from' && (
					<InputError color="var(--color-danger-700)" errorText="Minimum amount is 20 USDC" />
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
