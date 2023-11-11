import { walk } from "https://deno.land/std@0.206.0/fs/walk.ts"
import { asynciter } from "https://deno.land/x/asynciter@0.0.18/asynciter.ts"
import { assert } from "https://deno.land/std@0.206.0/assert/assert.ts"
import { toDate } from "../components/layout.tsx"
import { Nav } from "../components/nav.tsx"

export const getDate = async (path: string) =>
	(await Deno.lstat(path)).birthtime ?? new Date("1970-01-01")

type Post = { path: string; date: Date; title: string }

const Preview = ({ href, date, title }: { href: string; date: Date; title: string }) => (
	<li>
		<span>{toDate(date)}{" - "}</span>
		<a href={href}>{title}</a>
	</li>
)

export const previews = (posts: Post[]) =>
	posts
		.map(({ path, date, title }) => (
			<Preview
				href={`./${path.replace("posts/", "").replace(".tsx", ".html")}`}
				date={date}
				title={title}
			/>
		))

const loadPost = async (path: string) => {
	// FIXME: figure out why ../ has to be added
	const mod = await import(`../${path}`)
	assert(typeof mod.title === "string")

	const date = mod.date ?? await getDate(path)

	return { date, path, title: mod.title }
}

export const posts = await asynciter(
	// FIXME: do something with hard-coded path
	walk("posts/", { includeDirs: false, exts: [".tsx"], skip: [/index.tsx/] }),
)
	.concurrentUnorderedMap(async ({ path }) => {
		try {
			return [await loadPost(path)]
		} catch (e) {
			console.log(e)
			return []
		}
	})
	.collect()
	.then((posts) => posts.flat().sort((a, b) => b.date.getTime() - a.date.getTime()))

export default () => (
	<main>
		<header>
			<Nav />
		</header>
		<hr />
		<article>
			<ul>{previews(posts)}</ul>
		</article>
	</main>
)
