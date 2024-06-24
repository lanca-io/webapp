import { useEffect } from "react"
import { Navigator } from './Navigator'

function App() {

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const ref = urlParams.get('referral');
		const newRefParam = ref ? `?referral=${ref}` : "" 

		window.location.replace(`https://send.lanca.io/s/clxq1tsbr0000clnxl4mjkxzm${newRefParam}`)
	}, [])

	return <Navigator />
}

export default App
