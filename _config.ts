import lume from "lume/mod.ts"

import relativeUrls from "lume/plugins/relative_urls.ts"
import codeHighlight from "lume/plugins/code_highlight.ts"

import jsx from "lume/plugins/jsx_preact.ts"
import mdx from "lume/plugins/mdx.ts"

const site = lume({ prettyUrls: false })

site
	.copy([".css"])
	.copy("assets")
	.ignore("./README.md")
	.data("layout", "_includes/post.tsx")

site
	.use(jsx())
	.use(mdx())
	.use(codeHighlight())
	.use(relativeUrls())

export default site
