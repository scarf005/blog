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
