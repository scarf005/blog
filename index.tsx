import { toDate } from "~/_components/date.tsx"

export const title = "목차"
export const tags = ["meta"]

type Props = { url: string; date: Date; title?: string }

const Preview = ({ url, date, title }: Props) => (
	<li>
		<span>
			<time datetime={toDate(date)}>{toDate(date)}</time>
			{" - "}
		</span>
		<a href={url}>{title ?? url}</a>
	</li>
)

export default ({ search }: Lume.Data) => (
	<ul>
		{search.pages("!meta", "date=desc").map(Preview)}
	</ul>
)
