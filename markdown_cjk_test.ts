import { VFile } from "https://esm.sh/vfile@6.0.1"

import { unified } from "npm:unified@11.0.4"
import { rehypeStringify, remarkParse, remarkRehype } from "lume/deps/remark.ts"

import { fromMarkdown } from "npm:mdast-util-from-markdown@2.0.0"
import { toHast } from "npm:mdast-util-to-hast@13.1.0"

import { link } from "./markdown_cjk.ts"
import { assertEquals } from "$std/assert/assert_equals.ts"

const text = `[](#한글)`

const toHTML = () =>
	unified()
		.use(remarkParse)
		.use(remarkRehype, { handlers: { link } })
		.use(rehypeStringify)
		.process(
			new VFile({
				cwd: "/home/scarf/repo/blog",
				path: "/home/scarf/repo/blog/markdown_cjk_test.md",
				value: text,
			}),
		)

Deno.test("Hast does not normalize CJK", () =>
	toHTML()
		.then((file) => assertEquals(file.value, /*html*/ `<p><a href="#한글"></a></p>`)))

if (import.meta.main) {
	const mdast = fromMarkdown(text)
	console.log(mdast)

	const hast = toHast(mdast, { handlers: { link } })
	console.log(
		Deno.inspect(hast, { depth: Infinity, colors: true, compact: true, trailingComma: true }),
	)

	console.log(await toHTML())
}
