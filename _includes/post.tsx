import { getGitDate } from "lume/core/utils/date.ts"
import { DateRange } from "~/_components/date.tsx"
import { renderEmphasis } from "../render_emphasis.ts"

export const layout = "base.tsx"

export default ({ title, url, date, children, page }: Lume.Data, _helpers: Lume.Helpers) => {
	const src = page.src.entry?.src
	const modifiedDate = src ? getGitDate("modified", src) : undefined

	return (
		<>
			<header>
				<h1 dangerouslySetInnerHTML={{ __html: renderEmphasis(title ?? url) }} />
				<DateRange date={date} modifiedDate={modifiedDate ?? date} />
			</header>
			<main>{children}</main>
		</>
	)
}
