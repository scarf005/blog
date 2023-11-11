import { webSocketScript } from "./attach_ws.ts"
import { serveDir } from "https://deno.land/std@0.206.0/http/file_server.ts"
import { renderToStaticMarkup } from "$preact/render_to_string"
const isWebSocket = (req: Request) => req.headers.get("upgrade") === "websocket"

type Option = {
	clients: Set<WebSocket>
}

const handleWebsocketPool = (clients: Set<WebSocket>) => (req: Request): Promise<Response> => {
	const { socket, response } = Deno.upgradeWebSocket(req)
	socket.addEventListener("open", () => {
		clients.add(socket)
		console.log(`added websocket client, total clients: ${clients.size}`)
	})
	socket.addEventListener("close", () => {
		clients.delete(socket)
		console.log(`removed websocket client, total clients: ${clients.size}`)
	})
	return Promise.resolve(response)
}

const serveHtml = async (path: string, host: string, secure: boolean) => {
	console.log(`req: ${path}`)
	const { default: jsx } = await import(`./posts${path.replace("html", "tsx")}`)

	const markup = renderToStaticMarkup(jsx())
	console.log({ type: typeof jsx, markup })
	const wsInject = `<script>${webSocketScript({ host, secure })}</script>`
	const modifiedFile = markup.replace(
		"</body>",
		`${wsInject}</body>`,
	)
	return new Response(modifiedFile, {
		headers: {
			"content-type": "text/html",
		},
	})
}

export const handler = ({ clients }: Option) => (req: Request) => {
	const { protocol } = new URL(req.url)
	const secure = protocol === "https:"

	const wsHost = req.headers.get("host")!

	if (isWebSocket(req)) {
		return handleWebsocketPool(clients)(req)
	}

	const path = new URL(req.url, `http://${req.headers.get("host")}`).pathname

	console.log(path, path.endsWith("/"))
	const isPrettyUrl = path.endsWith("/") || path.endsWith(".html")
	const resolvedUrl = path.endsWith("/") ? `${path}index.html` : path

	if (isPrettyUrl) {
		return serveHtml(resolvedUrl, wsHost, secure)
	}
	return new Response("not found", { status: 404 })
}

const clients = new Set<WebSocket>()

type HMR = { detail: { path: string } }

Deno.serve({ port: 3000 }, handler({ clients }))
addEventListener("hmr", (e) => {
	console.log("HMR triggered", (e as unknown as HMR).detail.path)
	for (const client of clients) {
		client.send("reload")
	}
})
