import type { JSX } from "preact"

export const Video = (props: JSX.HTMLAttributes<HTMLSourceElement>) => (
	<video controls>
		<source {...props} />
	</video>
)
