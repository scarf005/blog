type Props = { href?: string }
export const Nav = ({ href }: Props) => (
	<nav>
		<a title="page home" href="/">/home</a>
		<a title="github address" href="/scarf005.html">/scarf</a>
		<a title="current page" href={href}>{href}</a>
	</nav>
)
