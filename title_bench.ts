import { assertEquals } from "$std/assert/assert_equals.ts"

const decoder = new TextDecoder()
export const fetchTitle = async (res: Response) => {
	const reader = res.body?.getReader()
	if (!reader) return null

	let title = ""
	while (true) {
		const { done, value } = await reader.read()
		if (done) break

		const chunk = decoder.decode(value, { stream: true })
		let titleStart = chunk.toLowerCase().indexOf("<title>")
		const titleEnd = chunk.toLowerCase().indexOf("</title>")

		if (titleStart !== -1) {
			titleStart += 7 // Length of '<title>'
			if (titleEnd === -1) {
				title += chunk.slice(titleStart)
			} else {
				title += chunk.slice(titleStart, titleEnd)
				break
			}
		} else if (titleEnd !== -1) {
			title += chunk.slice(0, titleEnd)
			break
		}
	}

	reader.cancel() // Abort the fetch operation
	return title.trim()
}

Deno.bench("hope it's not considered DDOS", async () => {
	assertEquals(
		await fetchTitle(
			await fetch("https://github.com/cataclysmbnteam/Cataclysm-BN/issues/3989"),
		),
		"supress warning for lua · Issue #3989 · cataclysmbnteam/Cataclysm-BN · GitHub",
	)
})
