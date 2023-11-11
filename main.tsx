import { Article, Lang, loadPost, Post, PostFile, toPostOfLocale } from "./load_post.ts"
import { walk } from "https://deno.land/std@0.201.0/fs/walk.ts"
import { asynciter } from "https://deno.land/x/asynciter@0.0.18/mod.ts"
import renderToString from "$preact/render_to_string"

const toDate = (date: Date) => date.toISOString().split("T")[0]

const style = /*css*/ `
    body {
        margin: auto;
        max-width: 100dvh;
        font-size: 1.5em;
    }
    ul {
        padding: 0;
        list-style-type: none;
    }
    a {
        color: #0069c2;
    }
    a:hover {
        text-decoration: none;
    }
`

const Head = () =>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta lang="ko" />
		<title>/home/scarf/</title>
		<style>
			${style}
		</style>
	</head>

// https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
const entries = await asynciter(walk("posts/", { includeDirs: false, exts: [".ts"] }))
	.concurrentUnorderedMap(({ path }) => loadPost(path))
	.collect()

console.log(entries)
const posts: Post[] = [
	{
		date: new Date("2023-09-06"),
		path: "/posts/etc/simple-is-best",
		ko: {
			title: "간단한 게 최고",
			summary: "왜 프레임워크 없이 블로그를 만들려는 걸까?",
			post: "",
		},
	},
]

const previews = (posts: Post[]) =>
	posts
		.flatMap(toPostOfLocale("ko"))
		.map(({ path, date, title, summary }) => (
			<>
				<li>
					<a href={path}>
						<h3>{title}</h3>
					</a>
					<span>{toDate(date)}</span>
					<p>
						{summary}
					</p>
				</li>
				<hr />
			</>
		))
const Body = () => (
	<body>
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
	</body>
)

const template = /*html*/ `
    <!DOCTYPE html>${
	renderToString(
		<>
			<Head />
			<Body />
		</>,
	)
}</html>
`

Deno.serve(
	{ port: 8080 },
	(_req) => new Response(template, { headers: { "content-type": "text/html" } }),
)

console.log(template)
