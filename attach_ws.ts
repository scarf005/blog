type Option = {
	secure?: boolean
	host: string
}

const onmessage = /* javascript */ `async ({ data }) => {
    console.log({ data })
    switch (data) {
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
}`
const onerror = "(e) => console.error(`WebSocket error: ${JSON.stringify(e)}`)"
const onclose = "(v) => console.log(v)"

export const webSocketScript = ({ secure = false, host }: Option) => {
	const protocol = secure ? "wss" : "ws"
	const url = `${protocol}://${host}`
	return `
    const socket = new WebSocket("${url}")
    socket.onopen = () => console.log("Socket listening at ${url}")
    socket.onmessage = ${onmessage}
    // socket.onerror = ${onerror}
    socket.onclose = ${onclose}

    function ping() {
      console.log("sending ping")
      socket.send("ping")
    }
  `
}
