import { Navigator } from './Navigator'
import { AppProviders } from './providers/AppProviders'
import '@concero/ui-kit/styles/lanca/index.css'
import './styles/App.css'

function App() {
	return (
		<AppProviders>
			<Navigator />
		</AppProviders>
	)
}

export default App
