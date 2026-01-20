import lume from "lume/mod.ts"

import relativeUrls from "lume/plugins/relative_urls.ts"
import resolveUrls from "lume/plugins/resolve_urls.ts"
import codeHighlight from "lume/plugins/code_highlight.ts"
import multilanguage from "lume/plugins/multilanguage.ts"

import jsx from "lume/plugins/jsx.ts"
import mdx from "lume/plugins/mdx.ts"
import redirects from "lume/plugins/redirects.ts"

import remark from "lume/plugins/remark.ts"
import rehypeSlug from "https://esm.sh/rehype-slug@6.0.0"
import rehypeAutolinkHeadings from "https://esm.sh/rehype-autolink-headings@7.1.0"
import { link } from "./markdown_cjk.ts"
import { copyButton } from "./copy_button.ts"
import { isNakedCssDay } from "./_components/naked_css.tsx"
import { autoId } from "./auto_id.ts"

const mdOption = {
	rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
	rehypeOptions: { handlers: { link } },
} satisfies Parameters<typeof remark>[0]

const site = lume({ prettyUrls: false, watcher: { ignore: [".metals", ".git"] } })

site
	.copy([".css"])
	.copy("assets")
	.ignore("./README.md", "AGENTS.md")
	.data("layout", "_includes/post.tsx")

site
	.add([".webp", ".svg", ".ico", ".png", ".jpg", ".jpeg", ".webm", ".mp4"])

site
	.use(jsx())
	.use(remark(mdOption))
	.use(mdx(mdOption))
	.use(codeHighlight())
	.use(resolveUrls())
	.use(redirects())
	.use(relativeUrls())
	.use(autoId({ languages: ["ko", "en", "ja"] }))
	.use(multilanguage({
		languages: ["ko", "en", "ja"],
		defaultLanguage: "ko",
	}))

if (!isNakedCssDay(new Date())) {
	site.use(copyButton())
}

export default site
