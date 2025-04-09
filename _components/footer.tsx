import { VNode } from "preact"

export const Footer = ({ children }: { children?: VNode }) => (
	<footer>
		© 2023-{new Date().getFullYear()} <a href="https://github.com/scarf005">scarf</a> |{" "}
		<a href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL-3.0-Only</a> |{" "}
		<a href="https://www.github.com/scarf005/blog">Source</a>
		{children}
	</footer>
)
