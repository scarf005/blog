import { Footer, Nav } from "~/_components/mod.ts"
import { isNakedCssDay, NakedCSS } from "../_components/naked_css.tsx"

declare global {
	namespace Lume {
		interface Data {
			// description of the page
			description?: string
		}
	}
}

export default ({ title, description, children, url }: Lume.Data) => (
	<html lang="ko">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />

			<title>{title ?? url}</title>
			<meta property="og:title" content={title} />
			<meta property="og:type" content="website" />
			<meta property="og:description" content={description ?? title} />
			<meta name="description" content={description ?? title} />

			<meta lang="ko" />
			<meta property="og:locale" content="ko" />

			<meta name="theme-color" content="#000000" />

			<link rel="icon" href="/assets/favicon.svg" />

			{isNakedCssDay(new Date()) ? undefined : (
				<>
					<link rel="stylesheet" href="/assets/style.css" />
					<link rel="stylesheet" href="/assets/url.css" />
					<link rel="stylesheet" href="/assets/highlight.css" />
					<noscript>
						<link rel="stylesheet" href="/assets/noscript.css" />
					</noscript>
				</>
			)}
		</head>
		<body>
			<Nav href={url} />
			<hr />
			{children}
			<Footer>
				{isNakedCssDay(new Date()) ? <NakedCSS /> : undefined}
			</Footer>
			<script type="module" src="/assets/flamethrower/flamethrower.js"></script>
			<script type="module" src="/assets/clipboard.js"></script>
		</body>
	</html>
)
