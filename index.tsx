import { toDate } from "~/_components/date.tsx"

type Props = { url: string; date: Date; title?: string }

const Preview = ({ url, date, title }: Props) => (
	<li>
		<span>{toDate(date)}{" - "}</span>
		<a href={url}>{title ?? url}</a>
	</li>
)

export default ({ search }: Lume.Data) => (
	<ul>
		{search.pages(undefined, "date=desc")
			.filter(({ url }) => url.startsWith("/posts"))
			.map(Preview)}
	</ul>
)
