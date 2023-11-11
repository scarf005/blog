import { webSocketScript } from "./attach_ws.ts"
import { renderToString } from "$preact/render_to_string"
import { style } from "./style.css.ts"
import { PostLayout } from "./components/post_layout.tsx"
import { sarasa } from "./sarasa.css.ts"
import { Layout } from "./components/layout.tsx"
import { Nav } from "./components/nav.tsx"

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

const serveTsx = async (path: string, host: string, secure: boolean) => {
	console.log(`req: ${path}`)
	const filePath = `./posts${path.replace("html", "tsx")}`
	const mod = await import(filePath)
	const isIndex = path.endsWith("index.html")
	const Component = mod.default as () => JSX.Element
	const stat = await Deno.lstat(filePath)
	const markup = renderToString(
		isIndex
			? (
				<Layout header={<Nav />}>
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
	const html = /*html*/ `
        <!DOCTYPE html>
        <html>
            <head>
                <title>/home/scarf${path}</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
		        <meta lang="ko" />
                <style>${sarasa}</style>
                <style>${style}</style>
                ${webSocketScript({ host, secure })}
                <script type="module">
                    import flamethrower from "https://esm.sh/flamethrower-router"
                    flamethrower({ log: true, pageTransitions: true })
                </script>
            </head>
            <body>
                ${markup}
            </body>
        </html>
    `
	return new Response(html, { headers: { "content-type": "text/html" } })
}

export const handler = ({ clients, hostname }: Option) => (req: Request) => {
	const { protocol } = new URL(req.url)
	const secure = protocol === "https:"

	const wsHost = req.headers.get("host")!

	if (isWebSocket(req)) {
		return handleWebsocketPool(clients)(req)
	}
	const url = new URL(req.url)
	if (url.hostname !== hostname) {
		return new Response(null, {
			status: 301,
			headers: {
				location: req.url,
			},
		})
	}

	const path = new URL(req.url, `http://${req.headers.get("host")}`).pathname

	console.log(path, path.endsWith("/"))
	const isPrettyUrl = path.endsWith("/") || path.endsWith(".html")
	const resolvedUrl = path.endsWith("/") ? `${path}index.html` : path

	if (isPrettyUrl) {
		return serveTsx(resolvedUrl, wsHost, secure)
	}
	// return new Response(null, {
	// 	status: 301,
	// 	headers: {
	// 		location: req.url,
	// 	},
	// })
	return new Response("not found", { status: 404 })
}

const clients = new Set<WebSocket>()

type HMR = { detail: { path: string } }

const hostname = "localhost"
Deno.serve({ port: 3000, hostname }, handler({ clients, hostname }))
addEventListener("hmr", (e) => {
	console.log("HMR triggered", (e as unknown as HMR).detail.path)
	clients.forEach((client) => {
		client.send("reload")
		console.log(`sent reload to ${client.url}`)
	})
})
