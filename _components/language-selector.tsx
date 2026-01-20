import { Data } from "lume/core/file.ts"

type Props = {
	currentLang: string
	alternates: Data[]
}

const langNames: Record<string, string> = {
	ko: "KO",
	en: "EN",
	ja: "JA",
}

export const LanguageSelector = ({ currentLang, alternates }: Props) => {
	const allLanguages = ["ko", "en", "ja"]

	const languageLinks = allLanguages.map((lang) => {
		const isCurrent = lang === currentLang
		const alternate = alternates.find((alt) => alt.lang === lang)
		const url = isCurrent ? undefined : alternate?.url

		return { lang, url, isCurrent }
	})

	return (
		<div class="language-selector">
			{languageLinks.map(({ lang, url, isCurrent }, idx) => (
				<>
					{idx > 0 && <span>/</span>}
					{isCurrent
						? <strong>{langNames[lang]}</strong>
						: url
						? (
							<a href={url} data-no-icon data-lang={lang}>
								{langNames[lang]}
							</a>
						)
						: <span class="unavailable">{langNames[lang]}</span>}
				</>
			))}
		</div>
	)
}
