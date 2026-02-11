#!/usr/bin/env -S deno run --allow-read

import { walk } from "jsr:@std/fs@^1/walk"
import { dirname, relative } from "jsr:@std/path@^1"

const RE = /^(?<base>.+?)(?:\.(?<lang>en|ja))?(?<ext>\.mdx?)$/

export type Missing = { name: string; missing: string[] }

export const checkTranslations = (paths: string[]): Missing[] => {
	const parsed = paths.map((p) => {
		const name = p.split("/").pop()!
		const m = RE.exec(name)!
		const dir = dirname(p) === "." ? "" : dirname(p) + "/"
		return { path: p, key: dir + m.groups!.base, lang: m.groups!.lang ?? "ko" }
	})

	const byKey = Object.groupBy(parsed, (x) => x.key)

	return Object.entries(byKey)
		.filter(([, xs]) => xs!.some((x) => x.lang === "ko"))
		.map(([key, xs]) => ({
			name: key,
			missing: ["en", "ja"].filter((l) => !xs!.some((x) => x.lang === l)),
		}))
		.filter((x) => x.missing.length > 0)
}

if (import.meta.main) {
	const entries = await Array.fromAsync(
		walk(Deno.args[0] || "./posts", { includeDirs: false, exts: [".md", ".mdx"] }),
	)
	const paths = entries.map((e) => relative(Deno.cwd(), e.path))
	const missing = checkTranslations(paths)

	if (missing.length === 0) {
		console.log("all translated")
		Deno.exit(0)
	}

	console.table(missing)
	Deno.exit(1)
}
