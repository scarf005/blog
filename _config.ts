import lume from "lume/mod.ts"
import relativeUrls from "lume/plugins/relative_urls.ts"
import jsx from "lume/plugins/jsx_preact.ts"
import inline from "lume/plugins/inline.ts"

const site = lume({ prettyUrls: false })

site
	.copy([".css"])
    .copy("assets")
	.ignore("./README.md")
	.data("layout", "_includes/post.tsx")

site
	.use(jsx())
	.use(inline())
	.use(relativeUrls())

export default site
