import { Button } from '../../../../../layout/buttons/Button/Button'
import classNames from './LPStreak.module.pcss'

export const LPStreak = (): JSX.Element => {
	return (
		<div className={classNames.container}>
			<div className={classNames.content}>
				<div className={classNames.iconWrapper}>
					<img src={'/RewardIcon.png'} alt={'rewards'} />
				</div>
				<div className="flex flex-col gap-sm">
					<div className={classNames.text}>
						<p className={classNames.header}>Earn 2x CERs!</p>
						<p className={classNames.subheader}>Hold LP for one month to double your rewards</p>
					</div>
					<a href={'https://app.concero.io/rewards'} target="_blank" rel="noreferrer">
						<Button size="md" className={classNames.actionButton}>
							Track LP streak
						</Button>
					</a>
				</div>
			</div>
		</div>
	)
}
