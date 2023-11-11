import { toDate } from "../../main.tsx"

export const title = "간단한 게 최고???"
export const date = new Date("2021-11-06")
export const modifiedDate = new Date()

export default () => (
	<div>
		<h1>{title}</h1>
        <span>{toDate(date)} - {toDate(modifiedDate)}</span>
		<hr />
		<p>이거 생각보다 복잡한데</p>
		<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
	</div>
)
