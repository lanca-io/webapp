import { FooterLogo } from '../../../assets/icons/FooterLogo'
import { Button } from '../buttons/Button/Button'
import classNames from './Footer.module.pcss'
import { type ReactNode } from 'react'
import { TwitterIcon } from '../../../assets/icons/Socials/TwitterIcon'
import { DiscordIcon } from '../../../assets/icons/Socials/DiscordIcon'
import { ArrowRight } from '../../../assets/icons/ArrowRight'

interface SocialIconWrapProps {
	children: ReactNode
	variant: 'iconBlue' | 'iconDark'
	href: string
}

const SocialIconWrap = ({ children, variant, href }: SocialIconWrapProps) => {
	return (
		<a
			target="_blank"
			href={href}
			className={`${classNames.socialIconWrap} ${classNames[variant]}`}
			rel="noreferrer"
		>
			{children}
		</a>
	)
}

export const Footer = () => {
	return (
		<footer className={classNames.footer}>
			<div className="wrap gap-lg">
				<div className={classNames.logoWrap}>
					<FooterLogo />
				</div>
				<div className="w-full jsb row wrap gap-xl">
					<div>
						<h3 className={classNames.title}>
							Bring cross chain to your <br /> product.
						</h3>
						<p className={`${classNames.subtitle} body2`}>Contact us to learn the benefits</p>
						<a target="_blank" rel="noreferrer" href="http://docs.lanca.io/">
							<Button size="sm" variant="secondaryColor" rightIcon={<ArrowRight />}>
								Lanca SDK
							</Button>
						</a>
					</div>

					<div className={classNames.navigation}>
						<div className={classNames.navigationLeft}>
							<div className={classNames.linkGroup}>
								<p className="body2">Integrate:</p>
								<a target="_blank" rel="noreferrer" href="https://docs.concero.io">
									<Button className={classNames.link} variant="tetrary" size="md">
										Documentation
									</Button>
								</a>
								<a target="_blank" rel="noreferrer" href="https://www.concero.io/whitepaper.pdf">
									<Button className={classNames.link} variant="tetrary" size="md">
										White paper
									</Button>
								</a>
							</div>

							<div className={classNames.linkGroup}>
								<p className="body2">Earn:</p>
								<a target="_blank" rel="noreferrer" href="https://app.concero.io/pool">
									<Button className={classNames.link} variant="tetrary" size="md">
										Provide Liquidity
									</Button>
								</a>

								<a target="_blank" rel="noreferrer" href="https://app.concero.io/rewards">
									<Button className={classNames.link} variant="tetrary" size="md">
										Rewards Portal
									</Button>
								</a>
							</div>
						</div>

						<div className={classNames.linkGroup}>
							<p className="body2">Socials:</p>
							<div className="row gap-sm">
								<SocialIconWrap href="https://x.com/lanca_io" variant="iconDark">
									<TwitterIcon />
								</SocialIconWrap>
								<SocialIconWrap href="http://discord.gg/lanca" variant="iconBlue">
									<DiscordIcon />
								</SocialIconWrap>
							</div>
						</div>
					</div>
				</div>
			</div>

			<a target="_blank" rel="noreferrer" href="https://www.concero.io" className={classNames.conceroText}>
				Powered by Concero
			</a>
		</footer>
	)
}
