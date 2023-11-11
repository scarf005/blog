import { Article, Lang, loadPost, Post, PostFile, toPostOfLocale } from "./load_post.ts"
import { walk } from "https://deno.land/std@0.201.0/fs/walk.ts"
import { asynciter } from "https://deno.land/x/asynciter@0.0.18/mod.ts"
import renderToString from "$preact/render_to_string"
import { style } from "./style.css.ts"

const toDate = (date: Date) => date.toISOString().split("T")[0]

const head = (): string => /*html*/ `
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta lang="ko" />
		<title>/home/scarf/</title>
		<style>${style}</style>
	</head>
`

// https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
const entries = await asynciter(walk("posts/", { includeDirs: false, exts: [".ts"] }))
	.concurrentUnorderedMap(({ path }) => loadPost(path))
	.collect()

console.log(entries)
const posts: Post[] = [
	{
		date: new Date("2023-11-11"),
		path: "/posts/etc/simple-is-best",
		ko: {
			title: "Linux와 한글 입력",
			post: "이거 또 왜 이래",
		},
	},
	{
		date: new Date("2023-09-06"),
		path: "/posts/etc/simple-is-best2",
		ko: {
			title: "Thunderbird",
			post: "이거 또 왜 이래",
		},
	},
]

const previews = (posts: Post[]) =>
	posts
		.flatMap(toPostOfLocale("ko"))
		.map(({ path, date, title }) => (
			<li>
				<span>{toDate(date)}{" - "}</span>
				<a href={path}>{title}</a>
			</li>
		))

const Body = () => (
	<body>
		<article>
			<header>
				<h1>
					/home/scarf/
				</h1>
			</header>
			<hr />
			<main>
				<ul>
					{previews(posts)}
				</ul>
			</main>
		</article>
	</body>
)

const template = /*html*/ `
    <!DOCTYPE html>${head()}${renderToString(<Body />)}</html>
`

Deno.serve(
	{ port: 8080 },
	(_req) => new Response(template, { headers: { "content-type": "text/html" } }),
)

console.log(template)
