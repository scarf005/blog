import lume from "lume/mod.ts"

import relativeUrls from "lume/plugins/relative_urls.ts"
import inline from "lume/plugins/inline.ts"
import minifyHTML from "lume/plugins/minify_html.ts"

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
	.use(inline())
	.use(relativeUrls())
	.use(minifyHTML())

export default site
