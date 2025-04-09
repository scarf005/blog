/**
 * between (10:00, April 8 UTC+00:00 to 12:00, April 10 UTC+00:00)
 *
 * @see https://css-naked-day.org
 */
export const isNakedCssDay = (date: Date) =>
	date >= new Date(`${thisYear}-04-08T10:00:00Z`) &&
	date <= new Date(`${thisYear}-04-10T12:00:00Z`)

const thisYear = new Date().getFullYear()

export const NakedCSS = () => (
	<p>
		<a href="https://css-naked-day.org">04-09는 CSS Naked Day</a>
	</p>
)
