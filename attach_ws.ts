type Option = {
	secure?: boolean
	host: string
}

export const webSocketScript = ({ secure = false, host }: Option) => {
	const protocol = secure ? "wss" : "ws"
	const url = `${protocol}://${host}`
	return /*html*/ `
        <script>
            const socket = new WebSocket("${url}")
            const onmessage = async (message) => {
                console.log("message:", message)
                switch (message.data) {
                    case "pong":
                        console.log("got pong")
                        break
                    case "reload":
                        console.log("reloading page")
                        location.reload()
                        break
                    default:
                        break
                }
            }
            socket.onopen = () => console.log("Socket listening at ${url}")
            socket.onmessage = onmessage
            socket.onerror = (e) => console.error("websocket error", JSON.stringify(e))
            socket.onclose = (v) => {
                console.log("close", v)
                setTimeout(() => location.reload(), 500)
            }

            function ping() {
                console.log("sending ping")
                socket.send("ping")
            }
        </script>
    `
}
