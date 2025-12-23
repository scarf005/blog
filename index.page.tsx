import { toDate } from "~/_components/mod.ts"
import { dirname } from "@std/path"
import { getStrings } from "~/_data.ts"
import { renderEmphasis } from "./render_emphasis.ts"

export const tags = ["meta"]
export const lang = ["ko", "en", "ja"]

type Props = { url: string; date: Date; title?: string }

const Preview = ({ url, date, title }: Props) => (
	<li>
		<span>
			<time datetime={toDate(date)}>{toDate(date)}</time>
			{" - "}
		</span>
		<a
			href={url}
			data-no-icon
			dangerouslySetInnerHTML={{ __html: renderEmphasis(title ?? url) }}
		/>
	</li>
)

type PageGenerator = Generator<Partial<Lume.Data>, void, undefined>

export default function* ({ url, search, lang = "ko" }: Lume.Data): PageGenerator {
	const strings = getStrings(lang)
	const pages = search.pages(`!meta lang=${lang}`, "date=desc")
	const groups = Object.groupBy(pages, (x) => dirname(x.url))

	yield {
		url,
		id: "index",
		title: strings.index.title,
		content: <ul>{pages.map(Preview)}</ul>,
	}

	yield* Object.entries(groups).map(([category, pages]) => ({
		url: `${category}/index.html`,
		id: `index-${category}`,
		title: category.replace("/", ""),
		content: <ul>{(pages ?? []).map(Preview)}</ul>,
	}))
}
