type Props = { href?: string }
export const Nav = ({ href }: Props) => (
	<nav>
		<h1>
			<a href="/">/home</a>
			<a href="https://github.com/scarf005">/scarf</a>
			<a href={href}>{href}</a>
		</h1>
	</nav>
)
