type Props = { href?: string }
export const Nav = ({ href }: Props) => {
	const sections = href?.replace("/", "").split("/").map((x) => `/${x}`)
	const links = sections?.slice(0, -1).map((x) => (
		<a title={x} href={x + "/index.html"} data-no-icon>{x}</a>
	))

	const last = sections?.at(-1)

	return (
		<nav>
			<a title="홈" href="/index.html" data-no-icon>/home</a>
			<a title="소개" href="/scarf005.html" data-no-icon>/scarf</a>
			{links}
			{last}
		</nav>
	)
}
