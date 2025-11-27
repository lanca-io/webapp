import './styles/index.css'
import { Navigator } from './Navigator'
import { ThemeProvider } from './hooks/themeContext'
import { Notifications } from './components/overlays/Notifications/Notifications'
import { NotificationsProvider } from './hooks/notificationsContext'
import { AppProviders } from './providers/AppProviders'
import '@concero/ui-kit/styles/lanca/index.css'

function App() {
	return (
		<AppProviders>
			<ThemeProvider>
				<NotificationsProvider>
					<Notifications />
					<Navigator />
				</NotificationsProvider>
			</ThemeProvider>
		</AppProviders>
	)
}

export default App
