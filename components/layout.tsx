import { Nav } from "./nav.tsx"

type Props = {
	header: JSX.Element
	children: JSX.Element
}
export const Layout = ({ header, children }: Props) => (
	<main>
		<header>{header}</header>
		<hr />
		<article>{children}</article>
	</main>
)
