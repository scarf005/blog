import { webSocketScript } from "./attach_ws.ts"
import { renderToString } from "$preact/render_to_string"
import { JSX } from "preact/jsx-runtime"
import { Date, Layout, Nav, PostLayout } from "~/components/mod.ts"

const isWebSocket = (req: Request) => req.headers.get("upgrade") === "websocket"

type Option = {
	clients: Set<WebSocket>
	hostname: string
}

const handleWebsocketPool = (clients: Set<WebSocket>) => (req: Request): Promise<Response> => {
	const { socket, response } = Deno.upgradeWebSocket(req)
	socket.addEventListener("open", () => {
		clients.add(socket)
	})
	socket.addEventListener("close", () => {
		clients.delete(socket)
	})
	return Promise.resolve(response)
}

export const serveTsx = async (path: string, host: string, secure: boolean) => {
	console.log(`req: ${path}`)
	const filePath = `./posts${path.replace(".html", ".tsx")}`
	const mod = await import(filePath)
	const isIndex = path.split("/").length === 2
	const Component = mod.default as () => JSX.Element
	const stat = await Deno.lstat(filePath)
	const markup = renderToString(
		isIndex
			? (
				<Layout nav={<Nav />}>
					<Component />
				</Layout>
			)
			: (
				<PostLayout
					path={path}
					date={mod.date ?? stat.birthtime}
					modifiedDate={mod.modifiedDate ?? stat.mtime}
					title={mod.title}
				>
					<Component />
				</PostLayout>
			),
	)
	const title = `/home/scarf${path}`
	const lang = "ko"
	return /*html*/ `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <title>${title}</title>
                <meta property="og:title" content="${title}" />

		        <meta lang="${lang}" />
                <meta property="og:locale" content="${lang}" />

                <link rel="stylesheet" href="/assets/3270.css" />
                <link rel="stylesheet" href="/assets/style.css" />

                ${webSocketScript({ host, secure })}
                <script type="module">
                    import flamethrower from "https://esm.sh/flamethrower-router"
                    flamethrower({ log: true, pageTransitions: true })
                </script>
            </head>
            <body>
                ${markup}
                <footer>
                    <p>© 2023 <a href="https://github.com/scarf005">scarf</a> | <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL-3.0-Only</a> | <a href="https://www.github.com/scarf005/blog">Source</a>
                </footer>
            </body>
        </html>
    `
}

const getLocalAddress = () => Deno.networkInterfaces().map((x) => x.address)

export const isExternalRequest = (hostname: "0.0.0.0" | "localhost" | string) => {
	const internal = ["0.0.0.0", "localhost", ...getLocalAddress()]
	return (url: URL) => {
		switch (hostname) {
			case "0.0.0.0":
			case "localhost":
				return !internal.includes(url.hostname)
			default:
				return url.hostname !== hostname
		}
	}
}

export const handler = ({ clients, hostname }: Option) => {
	const external = isExternalRequest(hostname)
	return async (req: Request) => {
		const { protocol } = new URL(req.url)
		const secure = protocol === "https:"

		const wsHost = req.headers.get("host")!

		if (isWebSocket(req)) {
			return handleWebsocketPool(clients)(req)
		}
		const url = new URL(req.url)
		if (external(url)) {
			console.log(url, hostname)
			return new Response(null, { status: 301, headers: { location: req.url } })
		}

		const path = new URL(req.url, `http://${req.headers.get("host")}`).pathname

		const isPrettyUrl = path.endsWith("/") || path.endsWith(".html")
		const resolvedUrl = path.endsWith("/") ? `${path}index.html` : path

		if (isPrettyUrl) {
			const html = await serveTsx(resolvedUrl, wsHost, secure)
			return new Response(html, { headers: { "content-type": "text/html" } })
		}
		if (path.endsWith(".css")) {
			const css = await Deno.readTextFile(`./${path}`)
			return new Response(css, {
				headers: {
					"content-type": "text/css",
					// "Cache-Control": "public, max-age=31536000, immutable",
				},
			})
		}
		if (path.endsWith(".woff2")) {
			const font = await Deno.readFile(`./${path}`)
			return new Response(font, {
				headers: {
					"content-type": "font/woff2",
					"Cache-Control": "public, max-age=31536000, immutable",
				},
			})
		}
		if (path.endsWith(".ico")) {
			return new Response(
				/*html*/ `
                <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                    <text x="10" y="42" font-family="Sarasa Mono Slab K" font-size="64" fill="black">></text>
                </svg>`,
				{ headers: { "content-type": "image/svg+xml" } },
			)
		}

		return new Response("not found", { status: 404 })
	}
}
type HMR = { detail: { path: string } }

if (import.meta.main) {
	const clients = new Set<WebSocket>()

	const hostname = "0.0.0.0"
	Deno.serve({ port: 3000, hostname }, handler({ clients, hostname }))
	addEventListener("hmr", (e) => {
		console.log("HMR triggered", (e as unknown as HMR).detail.path)
		clients.forEach((client) => {
			// TODO: do not run full page-refresh on CSS reload
			// or just use astro
			client.send("reload")
			console.log(`sent reload to ${client.url}`)
		})
	})
}
