import { Nav } from "./nav.tsx"
import { Date } from "./date.tsx"
import { Layout } from "./layout.tsx"
import { JSX } from "preact/jsx-runtime"

type Props = {
	path: string
	title: string
	date: Date
	modifiedDate: Date
	children: JSX.Element
}
export const PostLayout = ({ path, title, date, modifiedDate, children }: Props) => {
	return (
		<Layout header={<Nav href={path} />}>
			<>
				<h2>{title}</h2>
				<Date date={date} modifiedDate={modifiedDate} />
				<section>{children}</section>
			</>
		</Layout>
	)
}
