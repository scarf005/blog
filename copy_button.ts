export const copyButton = () => (site: Lume.Site) =>
	site.process([".html"], (pages) => {
		pages.forEach((page) =>
			page.document?.querySelectorAll("pre > code").forEach((code) => {
				const button = page.document.createElement("button")
				button.className = "copy"
				button.setAttribute("aria-label", "Copy to clipboard")
				code.parentElement?.appendChild(button)
			})
		)
	})
