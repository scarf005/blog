// deno-lint-ignore-file jsx-curly-braces
import { VNode } from "preact"
import { LanguageSelector } from "./language-selector.tsx"
import { Data } from "lume/core/file.ts"

type Props = {
	children?: VNode
	lang?: string
	alternates?: Data[]
}

export const Footer = ({ children, lang = "ko", alternates = [] }: Props) => (
	<footer>
		© 2023-{new Date().getFullYear()} <a href="https://github.com/scarf005">scarf</a> |{" "}
		<a href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL-3.0-Only</a> |{" "}
		<a href="https://www.github.com/scarf005/blog">Source</a>
		<span>{" | "}</span>
		<LanguageSelector currentLang={lang} alternates={alternates} />
		{children}
	</footer>
)
