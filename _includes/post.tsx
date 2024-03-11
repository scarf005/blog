import { DateRange } from "~/_components/date.tsx"

export const layout = "base.tsx"
export default ({ title, url, date, children }: Lume.Data, helpers: Lume.Helpers) => (
	<>
		<header>
			<h1>{title ?? url}</h1>
			<DateRange date={date} modifiedDate={date} />
		</header>
		<main>{children}</main>
	</>
)
