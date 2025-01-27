import lume from "lume/mod.ts"

import relativeUrls from "lume/plugins/relative_urls.ts"
import resolveUrls from "lume/plugins/resolve_urls.ts"
import codeHighlight from "lume/plugins/code_highlight.ts"

import jsx from "lume/plugins/jsx_preact.ts"
import mdx from "lume/plugins/mdx.ts"
import redirects from "lume/plugins/redirects.ts"

import remark from "lume/plugins/remark.ts"
import rehypeSlug from "https://esm.sh/rehype-slug@6.0.0"
import rehypeAutolinkHeadings from "https://esm.sh/rehype-autolink-headings@7.1.0"
import { link } from "./markdown_cjk.ts"

const mdOption = {
	rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
	rehypeOptions: { handlers: { link } },
} satisfies Parameters<typeof remark>[0]

const site = lume({ prettyUrls: false, watcher: { ignore: [".metals", ".git"] } })

site
	.copy([".css"])
	.copy("assets")
	.ignore("./README.md")
	.data("layout", "_includes/post.tsx")

site
	.use(jsx())
	.use(remark(mdOption))
	.use(mdx(mdOption))
	.use(codeHighlight())
	.use(relativeUrls())
	.use(resolveUrls())
	.use(redirects())

site.process([".html"], (pages) => {
	pages.forEach((page) =>
		page.document?.querySelectorAll("pre > code").forEach((code) => {
			const button = page.document!.createElement("button")
			button.className = "copy"
			button.setAttribute("aria-label", "Copy to clipboard")
			code.parentElement!.appendChild(button)
		})
	)
})

export default site
