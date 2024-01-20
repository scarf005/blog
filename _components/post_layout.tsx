import { Nav } from "./nav.tsx"
import { DateRange } from "./date.tsx"
import { Layout } from "./layout.tsx"
import { JSX } from "preact/jsx-runtime"

type Props = {
	path: string
	title: string
	date: Date
	modifiedDate: Date
	children: JSX.Element
}
export const PostLayout = (
	{ path, title, date, modifiedDate, children }: Props,
) => (
	<Layout nav={<Nav href={path} />}>
		<>
			<header>
				<h1>{title}</h1>
				<DateRange date={date} modifiedDate={modifiedDate} />
			</header>
			<main>{children}</main>
		</>
	</Layout>
)
