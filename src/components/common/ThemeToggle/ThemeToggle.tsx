import type { ReactElement } from 'react'
import { Theme } from '@/store/settings/types'
import { DarkThemeIcon } from '@/assets/DarkThemeIcon'
import { useSettingsStore } from '@/store/settings/useSettings'
import { useMemo } from 'react'
import { Switch } from '@concero/ui-kit'
import './ThemeToggle.pcss'

export const ThemeToggle = (): JSX.Element => {
	const { theme, setTheme } = useSettingsStore()

	const toggleTheme = (): void => {
		const theme: Theme = isDark ? Theme.LIGHT : Theme.DARK
		setTheme(theme)
	}

	const isDark: boolean = theme === Theme.DARK
	const icon: ReactElement = useMemo(() => <DarkThemeIcon />, [])
	const switcher: ReactElement = useMemo(
		() => <Switch checked={isDark} onChange={toggleTheme} />,
		[isDark, toggleTheme],
	)

	return (
		<div className="theme_toggle">
			{icon}
			<div className="theme_toggle_content">
				<span className="theme_toggle_label">Dark Theme</span>
				{switcher}
			</div>
		</div>
	)
}
