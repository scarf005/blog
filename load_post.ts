import { scope, type } from "npm:arktype@1.0.20-alpha"

export type Lang = typeof lang.infer
const lang = type("'ko' | 'en'")

export type Article = typeof article.infer
export type Post = typeof postFile.infer
export type ArticleFile = typeof articleFile.infer
export const { article, post, postFile, articleFile } = scope({
	article: {
		title: "string",
		summary: "string",
		post: "string",
	},
	post: {
		"ko?": "article",
		"en?": "article",
	},
	meta: {
		date: "Date",
		path: "string",
	},
	postFile: "post & meta",
	articleFile: "article & meta",
}).compile()

export type PostFile = Post & { date: Date; path: string }

export const defPost = <const T extends Post>(post: T & Post): Post => post

export const toPostOfLocale = (locale: Lang) => (post: Post) => {
	const article = post[locale]

	return article ? [{ ...post, ...article }] : []
}

export const getDate = async (path: string) =>
	(await Deno.lstat(path)).birthtime ?? new Date("1970-01-01")

type LoadPost = (path: string) => Promise<PostFile>
export const loadPost: LoadPost = async (path) => {
	const { default: raw } = await import(`./${path}`)
	post.assert(raw)

	const date = await getDate(path)

	return { ...raw, date, path }
}
