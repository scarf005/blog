import { assertEquals } from "jsr:@std/assert@^1"
import { checkTranslations } from "./check-translations.ts"

Deno.test("all translated - returns empty", () => {
	const result = checkTranslations(["post.md", "post.en.md", "post.ja.md"])
	assertEquals(result, [])
})

Deno.test("missing en", () => {
	const result = checkTranslations(["post.md", "post.ja.md"])
	assertEquals(result, [{ name: "post", missing: ["en"] }])
})

Deno.test("missing ja", () => {
	const result = checkTranslations(["post.md", "post.en.md"])
	assertEquals(result, [{ name: "post", missing: ["ja"] }])
})

Deno.test("missing both", () => {
	const result = checkTranslations(["post.md"])
	assertEquals(result, [{ name: "post", missing: ["en", "ja"] }])
})

Deno.test("nested dirs - groups by key", () => {
	const result = checkTranslations([
		"dir/post.md",
		"dir/post.en.md",
		"dir/post.ja.md",
		"other.md",
	])
	assertEquals(result, [{ name: "other", missing: ["en", "ja"] }])
})

Deno.test("mdx extension", () => {
	const result = checkTranslations(["post.mdx", "post.en.mdx"])
	assertEquals(result, [{ name: "post", missing: ["ja"] }])
})

Deno.test("no files - returns empty", () => {
	const result = checkTranslations([])
	assertEquals(result, [])
})

Deno.test("multiple missing", () => {
	const result = checkTranslations([
		"a.md",
		"b.md",
		"b.en.md",
	])
	assertEquals(result, [
		{ name: "a", missing: ["en", "ja"] },
		{ name: "b", missing: ["ja"] },
	])
})

Deno.test("ignores non-korean base", () => {
	const result = checkTranslations(["post.en.md", "post.ja.md"])
	assertEquals(result, [])
})
