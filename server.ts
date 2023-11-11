import { webSocketScript } from "./attach_ws.ts"
import { renderToString } from "$preact/render_to_string"
import { style } from "./style.css.ts"

const isWebSocket = (req: Request) => req.headers.get("upgrade") === "websocket"

type Option = {
	clients: Set<WebSocket>
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
	const { default: jsx } = await import(`./posts${path.replace("html", "tsx")}`)

	const markup = renderToString(jsx())
	const html = /*html*/ `
        <!DOCTYPE html>
        <html>
            <head>
                <title>/home/scarf${path}</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
		        <meta lang="ko" />
                <style>${style}</style>
            </head>
            <body>
                ${markup}
                ${webSocketScript({ host, secure })}
            </body>
        </html>
    `
	return new Response(html, { headers: { "content-type": "text/html" } })
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
		return serveTsx(resolvedUrl, wsHost, secure)
	}
	return new Response("not found", { status: 404 })
}

const clients = new Set<WebSocket>()

type HMR = { detail: { path: string } }

Deno.serve({ port: 3000 }, handler({ clients }))
addEventListener("hmr", (e) => {
	console.log("HMR triggered", (e as unknown as HMR).detail.path)
	clients.forEach((client) => client.send("reload"))
})
