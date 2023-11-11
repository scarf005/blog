import { unified } from "https://esm.sh/unified@10.1.2"
import remarkParse from "https://esm.sh/remark-parse@10.0.2"
import remarkFrontmatter from "https://esm.sh/remark-frontmatter@4.0.1"
import remarkGfm from "https://esm.sh/remark-gfm@3.0.1"
import remarkRehype from "https://esm.sh/remark-rehype@10.1.0"
import rehypeStringify from "https://esm.sh/rehype-stringify@9.0.3"

const renderer = unified()
	.use(remarkParse)
	.use(remarkFrontmatter)
	.use(remarkGfm)
	.use(remarkRehype)
	.use(rehypeStringify)

export const md2html = async (text: string) => String(await renderer.process(text))
