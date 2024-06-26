import { useEffect } from 'react'
import { Navigator } from './Navigator'

function App() {
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const ref = urlParams.get('referral')
		const newRefParam = ref ? `?referral=${ref}` : ''

		window.location.replace(`https://send.lanca.io/s/clxunwa70000cf8ncscr2vms7${newRefParam}`)
	}, [])

	return <Navigator />
}

export default App
