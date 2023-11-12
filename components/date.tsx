export const toDate = (date: Date) => date.toISOString().split("T")[0]
type DateOption = {
	date: Date
	modifiedDate: Date
}
export const Date = ({ date, modifiedDate }: DateOption) => {
	const dateStr = toDate(date)
	const modifiedDateStr = toDate(modifiedDate)

	const begin = <time dateTime={dateStr}>{dateStr}</time>
	const end = <time dateTime={modifiedDateStr}>{modifiedDateStr}</time>

	return dateStr === modifiedDateStr ? begin : <span>{begin} - {end}</span>
}
