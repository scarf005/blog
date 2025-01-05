import type { Handler, State } from "npm:mdast-util-to-hast@13.1.0"

/**
 * [link][link] handler from [mdast-util-to-hast](https://github.com/syntax-tree/mdast-util-to-hast)
 * without href normalization to handle CJK.
 *
 * [link]: <https://github.com/syntax-tree/mdast-util-to-hast/blob/c7a658efaf31316fe01033bada3e5f396cbc6576/lib/handlers/link.js#L10-L37>
 */
// deno-lint-ignore no-explicit-any
export const link: Handler = (state: State, node: any) => {
	const properties: Record<string, string> = { href: node.url }

	if (node.title !== null && node.title !== undefined) {
		properties.title = node.title
	}

	const result = {
		type: "element",
		tagName: "a",
		properties,
		children: state.all(node),
	} as const

	state.patch(node, result)
	return state.applyData(node, result)
}
