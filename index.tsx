import { toDate } from "~/_components/mod.ts"
import { dirname } from "$std/path/dirname.ts"

export const title = "목차"
export const tags = ["meta"]

type Props = { url: string; date: Date; title?: string }

const Preview = ({ url, date, title }: Props) => (
	<li>
		<span>
			<time datetime={toDate(date)}>{toDate(date)}</time>
			{" - "}
		</span>
		<a href={url} data-no-icon>{title ?? url}</a>
	</li>
)

type PageGenerator = Generator<Partial<Lume.Data>, void, undefined>

export default function* ({ url, search }: Lume.Data): PageGenerator {
	const pages = search.pages("!meta", "date=desc")
	const groups = Object.groupBy(pages, (x) => dirname(x.url))

	yield {
		url,
		content: <ul>{pages.map(Preview)}</ul>,
	}

	yield* Object.entries(groups).map(([category, pages]) => ({
		url: `${category}/index.html`,
		title: category.replace("/", ""),
		content: <ul>{pages!.map(Preview)}</ul>,
	}))
}
