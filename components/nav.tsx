type Props = { href?: string }
export const Nav = ({ href }: Props) => (
	<nav>
		<h1>
			<a title="page home" href="/">/home</a>
			<a title="github address" href="https://github.com/scarf005">/scarf</a>
			<a title="current page" href={href}>{href}</a>
		</h1>
	</nav>
)
