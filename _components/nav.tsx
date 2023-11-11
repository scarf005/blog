type Props = { href?: string }
export const Nav = ({ href }: Props) => (
	<nav>
		<a title="홈" href="/index.html">/home</a>
		<a title="소개" href="/scarf005.html">/scarf</a>
		{href}
	</nav>
)
