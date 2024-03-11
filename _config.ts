import lume from "lume/mod.ts"

import relativeUrls from "lume/plugins/relative_urls.ts"
import codeHighlight from "lume/plugins/code_highlight.ts"

import jsx from "lume/plugins/jsx_preact.ts"
import mdx from "lume/plugins/mdx.ts"

import remark from "lume/plugins/remark.ts"
import rehypeSlug from "https://esm.sh/rehype-slug@6.0.0"
import rehypeAutolinkHeadings from "https://esm.sh/rehype-autolink-headings@7.1.0"
import { link } from "./markdown_cjk.ts"

const mdOption = {
	rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
	rehypeOptions: { handlers: { link } },
}

const site = lume({ prettyUrls: false })

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

export default site
