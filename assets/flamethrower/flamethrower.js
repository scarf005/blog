import flamethrower from "https://cdn.jsdelivr.net/gh/scarf005/flamethrower@0.0.1/lib/main.js"

flamethrower({
	log: globalThis.location.hostname === "localhost",
	prefetch: "visible",
})
