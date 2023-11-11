import { Nav } from "./nav.tsx"
export const toDate = (date: Date) => date.toISOString().split("T")[0]

type DateOption = {
	date: Date
	modifiedDate: Date
}
export const Date = ({ date, modifiedDate }: DateOption) => {
	const dateStr = toDate(date)
	const modifiedDateStr = toDate(modifiedDate)
	return (
		<span>
			{dateStr === modifiedDateStr ? dateStr : `${dateStr} - ${modifiedDateStr}`}
		</span>
	)
}
type Props = {
	path: string
	title: string
	date: Date
	modifiedDate: Date
	children: JSX.Element
}
export const Layout = ({ path, title, date, modifiedDate, children }: Props) => {
	return (
		<article>
			<Nav href={path} />
			<hr />
			<header>
				<h2>{title}</h2>
				<Date date={date} modifiedDate={modifiedDate} />
			</header>
			<main>
				{children}
			</main>
		</article>
	)
}