const copied = "copied"
document.querySelectorAll("button.copy").forEach((button) => {
	button.addEventListener("click", () => {
		const code = button.parentElement?.querySelector("code")?.innerText
		if (!code) return
		navigator.clipboard.writeText(code).then(() => {
			button.classList.add(copied)
			setTimeout(() => button.classList.remove(copied), 2000)
		}).catch((err) => console.error("Failed to copy:", err))
	})
})
