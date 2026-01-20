import { toKebabCase } from "@std/text/to-kebab-case"

/**
 * Assign default `id` and `lang` based on the filename suffix and title slug.
 * e.g `posts/scarf005.en.md` will have `id` from the default file title and `lang` of `en`.
 * e.g `posts/scarf005.md` will have the same `id` (default language).
 */
export const autoId = (options: { languages: string[] }) => {
	const languageSuffix = new RegExp(`\\.(${options.languages.join("|")})$`)

	return (site: Lume.Site) => {
		site.parseBasename((basename) => {
			const match = basename.match(languageSuffix)
			if (!match) return

			return { basename: basename.replace(languageSuffix, ""), lang: match[1] }
		})

		site.preprocess([".md", ".mdx"], (files) => {
			const groups = Map.groupBy(files, (file) => file.src.path.replace(languageSuffix, ""))

			groups.forEach((files, key) => {
				const defaultFile = files.find((file) => !languageSuffix.test(file.src.path))
				const title = defaultFile?.data.title ??
					files.find((file) => file.data.title)?.data.title
				const slug = title ? toKebabCase(String(title)) : ""
				const fallback = key.replace(/^\/posts\//, "").replace(/^\//, "")

				files.forEach((file) => {
					file.data.id ??= slug || fallback
					file.data.lang ??= file.src.path.match(languageSuffix)?.at(1)
				})
			})
		})
	}
}
