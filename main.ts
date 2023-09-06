const toDate = (date: Date) => date.toISOString().split("T")[0]

const style = /*css*/`
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

const head = /*html*/`
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta lang="ko" />
        <title>/home/scarf/</title>
        <style>
            ${style}
        </style>
    </head>
`
// https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png

export type Post = {
	title: string
	date: Date
	summary: string
	path: string
	post?: string
}

const posts: Post[] = [
	{
		title: "간단한 게 최고",
		date: new Date("2023-09-06"),
		summary: "왜 프레임워크 없이 블로그를 만들려는 걸까?",
		path: "/posts/etc/simple-is-best",
	},
]

const previews = (posts: Post[]): string =>
	posts.map(({ path, title, summary, date }) => /*html*/ `
        <li>
            <a href="${path}">
                <h3>${title}</h3>
            </a>
            <span>${toDate(date)}</span>
            <p>
                ${summary}
            </p>
        </li>
        <hr />
    `)
		.join("\n")

const body = /*html*/`
    <body>
        <header>
            <h1>
                /home/scarf/
            </h1>
        </header>
        <hr />
        <main>
            <ul>
                ${previews(posts)}
            </ul>
        </main>
    </body>
`

const template = /*html*/`
    <!DOCTYPE html>
        ${head}
        ${body}
    </html>
`

Deno.serve(
	{ port: 8080 },
	(_req) => new Response(template, { headers: { "content-type": "text/html" } }),
)
