import { html, tokens } from "https://deno.land/x/rusty_markdown@v0.4.1/mod.ts"

export const noop = (xs: TemplateStringsArray, ...ys: string[]) => {
	const lastLength = xs.length - 1
	return xs.slice(0, lastLength).reduce((acc, x, i) => acc + x + ys[i], "") + xs[lastLength]
}

export const md = (xs: TemplateStringsArray, ...ys: string[]) => (
	<section dangerouslySetInnerHTML={{ __html: html(tokens(noop(xs, ...ys))) }} />
)
