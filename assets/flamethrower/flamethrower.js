// @deno-types="https://esm.sh/v135/flamethrower-router@0.0.0-meme.12"
import flamethrower from "https://esm.sh/v135/flamethrower-router@0.0.0-meme.12/es2022/flamethrower-router.mjs"

flamethrower({
	log: globalThis.location.hostname === "localhost",
	prefetch: "visible",
	pageTransitions: true,
})
