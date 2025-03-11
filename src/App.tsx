import './styles/App.css'
import { Navigator } from './Navigator'
import { ThemeProvider } from './hooks/themeContext'
import { SelectionProvider } from './hooks/SelectionContext'
import { Notifications } from './components/overlays/Notifications/Notifications'
import { NotificationsProvider } from './hooks/notificationsContext'
import { DataProvider } from './hooks/DataContext/DataContext'
import { AppProviders } from './providers/AppProviders'

function App() {
	return (
		<AppProviders>
			<DataProvider>
				<SelectionProvider>
					<ThemeProvider>
						<NotificationsProvider>
							<Notifications />
							<Navigator />
						</NotificationsProvider>
					</ThemeProvider>
				</SelectionProvider>
			</DataProvider>
		</AppProviders>
	)
}

export default App
