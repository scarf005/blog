import { PostLayout } from "~/_components/post_layout.tsx"
import { Footer } from "~/_components/footer.tsx"

export const layout = "base.tsx"
export default ({ title, url, date, children }: Lume.Data, helpers: Lume.Helpers) => (
	<>
		<PostLayout
			path={url}
			date={date}
			modifiedDate={date}
			// modifiedDate={mod.modifiedDate ?? stat.mtime}
			title={title ?? "목차"}
		>
			{children}
		</PostLayout>
		<Footer />
	</>
)
