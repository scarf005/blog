import { getStrings } from "~/_data.ts"

const toLocalizedPath = (path: string, lang: string) => lang === "ko" ? path : `/${lang}${path}`
const normalizePath = (href?: string) => href?.endsWith("/") ? `${href}index.html` : href

type Props = {
	href?: string
	lang?: string
}

export type Breadcrumb = {
	label: string
	href?: string
	title: string
}

export const getBreadcrumbs = ({ href, lang = "ko" }: Props): Breadcrumb[] => {
	const strings = getStrings(lang)
	const segments = normalizePath(href)?.split("/").filter(Boolean) ?? []
	const pathBreadcrumbs = segments.map((segment, idx) => {
		const path = `/${segments.slice(0, idx + 1).join("/")}`
		const title = `/home/scarf${path}`

		return {
			label: `/${segment}`,
			href: idx === segments.length - 1 ? undefined : `${path}/index.html`,
			title,
		}
	})

	return [
		{ label: "/home", href: toLocalizedPath("/index.html", lang), title: strings.nav.home },
		{
			label: "/scarf",
			href: toLocalizedPath("/scarf005.html", lang),
			title: strings.nav.about,
		},
		...pathBreadcrumbs,
	]
}

export const Nav = (props: Props) => (
	<nav>
		{getBreadcrumbs(props).map(({ label, href, title }) =>
			href
				? <a key={title} title={title} href={href} data-no-icon>{label}</a>
				: <span key={title} title={title}>{label}</span>
		)}
	</nav>
)
