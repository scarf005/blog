import { posts, previews } from "./posts/index.tsx"
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
	title: string
	date: Date
	modifiedDate: Date
	children: JSX.Element
}
export const Layout = ({
	title,
	date,
	modifiedDate,
	children,
}: Props) => {
	return (
		<article>
			<header>
				<h1>{title}</h1>
				<Date date={date} modifiedDate={modifiedDate} />
			</header>
			<hr />
			<main>
				{children}
			</main>
		</article>
	)
}
