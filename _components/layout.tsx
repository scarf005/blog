import { JSX } from "preact/jsx-runtime"

type Props = {
	nav: JSX.Element
	children: JSX.Element
}
export const Layout = ({ nav, children }: Props) => (
	<>
		{nav}
		<hr />
		<main>{children}</main>
	</>
)
