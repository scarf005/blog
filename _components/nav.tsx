import { getStrings } from "~/_data.ts"

const toLocalizedPath = (path: string, lang: string) =>
	lang === "ko" ? path : `/${lang}${path}`

type Props = {
	href?: string
	lang?: string
}

export const Nav = ({ href, lang = "ko" }: Props) => {
	const strings = getStrings(lang)
	const segments = href?.split("/").filter(Boolean) ?? []
	const sectionSegments = segments.at(-1)?.endsWith(".html") ? segments.slice(0, -1) : segments
	const links = sectionSegments.slice(0, -1).map((_, idx) => {
		const path = `/${sectionSegments.slice(0, idx + 1).join("/")}`

		return <a key={path} title={path} href={`${path}/index.html`} data-no-icon>{path}</a>
	})

	const last = sectionSegments.at(-1) ? `/${sectionSegments.at(-1)}` : undefined

	return (
		<nav>
			<a title={strings.nav.home} href={toLocalizedPath("/index.html", lang)} data-no-icon>/home</a>
			<a title={strings.nav.about} href={toLocalizedPath("/scarf005.html", lang)} data-no-icon>/scarf</a>
			{links}
			{last}
		</nav>
	)
}
