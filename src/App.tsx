import { useEffect } from "react"

function App() {

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const ref = urlParams.get('ref');
		const newRefParam = ref ? `?ref=${ref}` : "" 

		window.location.replace(`https://send.lanca.io/s/clxq1tsbr0000clnxl4mjkxzm${newRefParam}`)
	}, [])

	return null
}

export default App
