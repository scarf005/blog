const LANG_STORAGE_KEY = "preferred-lang"
const DEFAULT_LANG = "ko"
const SUPPORTED_LANGS = ["ko", "en", "ja"]

const getCurrentLang = () => {
	const lang = document.documentElement?.lang?.toLowerCase() ?? ""
	return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG
}

const isInitialLanguageRedirect = () => {
	const current = globalThis.location.pathname
	const stored = sessionStorage.getItem("lang-initial-path")
	if (stored && stored !== current) {
		return false
	}

	sessionStorage.setItem("lang-initial-path", current)
	return true
}

const getStoredLang = () => {
	const stored = localStorage.getItem(LANG_STORAGE_KEY)
	return stored && SUPPORTED_LANGS.includes(stored) ? stored : undefined
}

const getBrowserLang = () => {
	const preferred = navigator.languages?.length ? navigator.languages : [navigator.language]
	const match = preferred
		.map((lang) => lang.toLowerCase().split("-")[0])
		.find((lang) => SUPPORTED_LANGS.includes(lang))
	return match ?? DEFAULT_LANG
}

const maybeRedirectByLang = () => {
	const currentLang = getCurrentLang()
	const stored = getStoredLang()
	const preferred = stored ?? getBrowserLang()
	if (preferred === currentLang) return
	if (!isInitialLanguageRedirect()) return

	const target = document.querySelector(
		`.language-selector a[href][data-lang="${preferred}"]`,
	)?.getAttribute("href")
	if (!target) return

	if (!stored) {
		localStorage.setItem(LANG_STORAGE_KEY, preferred)
	}
	globalThis.location.href = target
}

const wireLanguageSelection = () => {
	document.querySelectorAll(".language-selector a[href]").forEach((link) => {
		const lang = link.getAttribute("data-lang")
		if (!lang) return
		link.addEventListener("click", () => {
			localStorage.setItem(LANG_STORAGE_KEY, lang)
		})
	})
}

maybeRedirectByLang()
wireLanguageSelection()
