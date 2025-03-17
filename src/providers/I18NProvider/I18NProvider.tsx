import type { FC, PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { getItem } from '../../utils/localStorage'
import { translations } from './translations'

import i18next from 'i18next'

const i18n = i18next.createInstance({
	debug: false,
	fallbackLng: 'en',
	lng: getItem<string>('language', 'en') ?? 'en',
	resources: translations,
})

i18n.init()

export const I18NProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
