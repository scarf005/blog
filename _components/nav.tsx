import { getStrings } from "~/_data.ts"
type Props = {
	href?: string
	lang?: string
}

export const Nav = ({ href, lang = "ko" }: Props) => {
	const strings = getStrings(lang)
	const sections = href?.replace("/", "").split("/").map((x) => `/${x}`)
	const links = sections?.slice(0, -1).map((x) => (
		<a title={x} href={x + "/index.html"} data-no-icon>{x}</a>
	))

	const last = sections?.at(-1)

	return (
		<nav>
			<a title={strings.nav.home} href="/index.html" data-no-icon>/home</a>
			<a title={strings.nav.about} href="/scarf005.html" data-no-icon>/scarf</a>
			{links}
			{last}
		</nav>
	)
}
