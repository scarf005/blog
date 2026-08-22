import { assertEquals } from "@std/assert"
import { getBreadcrumbs } from "./nav.tsx"

const breadcrumbPath = (href: string, lang: string) =>
	getBreadcrumbs({ href, lang }).map(({ label }) => label).join("")

Deno.test("Nav shows the full Korean post path", () => {
	assertEquals(
		breadcrumbPath("/etc/android-share.html", "ko"),
		"/home/scarf/etc/android-share.html",
	)
	assertEquals(
		getBreadcrumbs({ href: "/etc/android-share.html", lang: "ko" }).map(({ href }) => href),
		["/index.html", "/scarf005.html", "/etc/index.html", undefined],
	)
})

Deno.test("Nav shows the language segment in a localized post path", () => {
	assertEquals(
		breadcrumbPath("/en/etc/android-share.html", "en"),
		"/home/scarf/en/etc/android-share.html",
	)
	assertEquals(
		getBreadcrumbs({ href: "/en/etc/android-share.html", lang: "en" }).map(({ href }) => href),
		["/en/index.html", "/en/scarf005.html", "/en/index.html", "/en/etc/index.html", undefined],
	)
	assertEquals(
		getBreadcrumbs({ href: "/en/etc/android-share.html", lang: "en" })
			.slice(0, 2)
			.map(({ title }) => title),
		["Home", "About"],
	)
})

Deno.test("Nav keeps index filenames for root and category pages", () => {
	assertEquals(breadcrumbPath("/", "ko"), "/home/scarf/index.html")
	assertEquals(breadcrumbPath("/etc/", "ko"), "/home/scarf/etc/index.html")
	assertEquals(
		breadcrumbPath("/ja/etc/index.html", "ja"),
		"/home/scarf/ja/etc/index.html",
	)
	assertEquals(
		getBreadcrumbs({ href: "/ja/etc/index.html", lang: "ja" }).at(-1),
		{ label: "/index.html", href: undefined, title: "/home/scarf/ja/etc/index.html" },
	)
})
